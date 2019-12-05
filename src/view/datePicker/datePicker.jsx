import React from 'react'
import PropTypes, { func } from 'prop-types'
import './datePicker.scss'
const weeksHeader = [
    { show: '一', title: '周一' },
    { show: '二', title: '周二' },
    { show: '三', title: '周三' },
    { show: '四', title: '周四' },
    { show: '五', title: '周五' },
    { show: '六', title: '周六' },
    { show: '日', title: '周日' },
]
function getDayTimestamp(timestamp = Date.now()) {
    const result = new Date(timestamp)
    result.setHours(0)
    result.setMinutes(0)
    result.setSeconds(0)
    result.setMilliseconds(0)
    return result.getTime()
}
function formatDate(timestamp) {
    let date = new Date(timestamp)
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    return `${year}-${month >= 10 ? month : '0' + month}-${day >= 10 ? day : '0' + day}`
}
function getYear(timestamp) {
    let date = new Date(timestamp)
    return date.getFullYear()
}
function getMonth(timestamp) {
    let date = new Date(timestamp)
    return date.getMonth() + 1
}
function getDate(timestamp) {
    let date = new Date(timestamp)
    return date.getDate()
}
class DatePicker extends React.Component {
    constructor(props) {
        super(props)
        let now = getDayTimestamp()
        this.state = {
            today: now,
            selectedDay: now,
            panelYear: getYear(now),
            panelMonth: getMonth(now),
            panelDay: now,
            inputValue: formatDate(now),
            weeks: []
        }
    }
    componentDidMount() {
        this.getMonthDays()
    }
    selectDay = (days) => {
        let { panelYear, panelMonth, panelDay } = this.state
        let selectYear = getYear(days)
        let selectMonth = getMonth(days)
        if (panelYear !== selectYear || panelMonth !== selectMonth) {
            if (days > panelDay) {
                this.changeCurrentDatePickerMonth('add', 1, null)
            } else {
                this.changeCurrentDatePickerMonth('reduce', 1, null)
            }
        }
        this.setState({
            selectedDay: days,
            inputValue: formatDate(days)
        })
    }
    changeCurrentDatePickerMonth = (type, step, event) => {

        let { panelDay } = this.state
        let panelDate = new Date(panelDay)
        if (type === 'add') {
            panelDate.setMonth(panelDate.getMonth() + step)
        } else if (type === 'reduce') {
            panelDate.setMonth(panelDate.getMonth() - step)
        }

        let timestamp = panelDate.getTime()


        this.getMonthDays(timestamp)
    }
    changeCurrentDatePickerYear = (type, step, e) => {

        let { panelDay } = this.state
        let panelDate = new Date(panelDay)
        if (type === 'add') {
            panelDate.setFullYear(panelDate.getFullYear() + step)
        } else if (type === 'reduce') {
            panelDate.setFullYear(panelDate.getFullYear() - step)
        }

        let timestamp = panelDate.getTime()


        this.getMonthDays(timestamp)
    }
    getMonthDays = (timestamp = getDayTimestamp(), callback) => {
        let now = new Date(timestamp)
        now.setDate(1) //将时间设为每月一日
        let startDay = new Date(now.getTime())
        let currentDay = new Date(now.getTime())
        let days = []
        while (startDay.getMonth() === currentDay.getMonth()) {
            days.push(currentDay.getTime())
            currentDay.setDate(currentDay.getDate() + 1)
        }

        let prevDays = []
        let prevDaysLength = startDay.getDay() ? startDay.getDay() - 1 : 6
        for (let i = 1; i <= prevDaysLength; i++) {
            let prevDay = new Date(now.getTime())
            prevDay.setDate(prevDay.getDate() - i)
            prevDays.unshift(prevDay.getTime())
        }
        days = prevDays.concat(days)
        let lastDay = new Date(days[days.length - 1])
        let nextDays = []
        let nextDaysLength = lastDay.getDay() ? 7 - lastDay.getDay() : 0
        for (let i = 1; i <= nextDaysLength; i++) {
            let nextDay = new Date(lastDay.getTime())
            nextDay.setDate(nextDay.getDate() + i)
            nextDays.push(nextDay.getTime())
        }
        days = days.concat(nextDays)
        if (days.length !== 42) {
            //不足42个数据补充到42个
            lastDay = new Date(days[days.length - 1])
            let repairDays = []
            for (let i = 1; i <= 42 - days.length; i++) {
                let repairDay = new Date(lastDay.getTime())
                repairDay.setDate(repairDay.getDate() + i)
                repairDays.push(repairDay.getTime())
            }
            days = days.concat(repairDays)
        }
        let weeks = []
        for (let i = 0; i < days.length / 7; i++) {
            let week = days.slice(i * 7, (i + 1) * 7)
            weeks.push(week)
        }
        let panelYear = getYear(timestamp)
        let panelMonth = getMonth(timestamp)
        let panelDay = timestamp
        this.setState({
            weeks: weeks,
            panelYear: panelYear,
            panelMonth: panelMonth,
            panelDay: panelDay
        }, () => {
            if (callback) {
                callback(timestamp)
            }
        })
    }
    inputChange = (e) => {
        let value = e.target.value
        this.setState({
            inputValue: value
        })
    }
    inputBlur = () => {
        let { inputValue, selectedDay } = this.state
        let date = new Date(inputValue)
        if (date == 'Invalid Date') {
            this.setState({
                inputValue: formatDate(selectedDay)
            })
            return
        } else {
            let arr = inputValue.split('-')
            if (arr.length === 3) {
                let timestamp = new Date(inputValue).getTime()
                this.getMonthDays(timestamp, this.selectDay)
            } else {
                this.setState({
                    inputValue: formatDate(selectedDay)
                })
            }
        }

    }
    render() {
        const { panelYear, panelMonth, weeks, today, selectedDay, inputValue } = this.state
        return (
            <div className="show_datepicker_content">
                <div className="datepicker_wrapper">
                    <div className="datepicker_input_wrap">
                        <input type="text"
                            className="datepicker_input"
                            value={inputValue}
                            onChange={this.inputChange}
                            onBlur={this.inputBlur}
                        />
                    </div>
                    <div className="datepicker_panel_wrap">
                        <div className="datepicker_panel_header">
                            <span className="datepicker_prev_year_btn" onClick={this.changeCurrentDatePickerYear.bind(this, 'reduce', 1)}></span>
                            <span className="datepicker_prev_month_btn" onClick={this.changeCurrentDatePickerMonth.bind(this, 'reduce', 1)}></span>
                            <span className="datepicker_select">
                                <span className="datepicker_select_year">{panelYear}年</span>
                                <span className="datepicker_select_month">{panelMonth}月</span>
                            </span>
                            <span className="datepicker_next_month_btn" onClick={this.changeCurrentDatePickerMonth.bind(this, 'add', 1)}></span>
                            <span className="datepicker_next_year_btn" onClick={this.changeCurrentDatePickerYear.bind(this, 'add', 1)}></span>
                        </div>
                        <div className="datepicker_panel_body">
                            <div className="datepicker_weekheader_body">
                                {
                                    weeksHeader.map((item, index) => {
                                        return (
                                            <div className="datepicker_weekheader_cell" title={item.title} key={index}>{item.show}</div>
                                        )
                                    })
                                }
                            </div>
                            <div className="datepicker_day_body">
                                {
                                    weeks.map((week, weekIndex) => {

                                        return (
                                            <div className="datepicker_week_cell" key={weekIndex} >
                                                {
                                                    week.map((day) => {
                                                        return (
                                                            <div
                                                                className={`datepicker_day_cell `}
                                                                key={day}
                                                                title={formatDate(day)}
                                                                onClick={this.selectDay.bind(this, day)}
                                                            >
                                                                <div className={`
                                                                datepicker_day_date 
                                                                ${today === day ? 'datepicker_day_today' : ''}
                                                                ${selectedDay === day ? 'datepicker_day_selected' : ''}
                                                                ${getMonth(day) === panelMonth ? '' : day > today ? 'datepicker_day_next_month' : 'datepicker_day_prev_month'}
                                                                `}>
                                                                    {getDate(day)}
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="datepicker_panel_footer">

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default DatePicker