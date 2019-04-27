import React from 'react'
// import PropTypes from 'prop-types'
import './mind.scss'
import { Menu, Dropdown, Modal, Input } from 'antd'
const MockBoxList = [
    { id: 1, top: 100, left: 200, width: 200, height: 150, title: '开场白', type: 'box' },
    { id: 2, top: 200, left: 500, width: 200, height: 150, title: '场景一', type: 'box' },
    { id: 3, top: 300, left: 800, width: 200, height: 150, title: '结束语', type: 'box' }
]
const MockLineList = [
    { id: 1, parent_id: 1, child_id: 2, type: 'line' },
    { id: 2, parent_id: 2, child_id: 3, type: 'line' }
]
let nowTimestamp = new Date().getTime()
let BoxCount = 0
let LineCount = 0
class Mind extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            BoxList: MockBoxList,
            LineList: MockLineList,
            StageScale: 1,
            StageX: 0,
            StageY: 0,
            RelativeStageX: null,//拖动时舞台位置不为0时的相对偏移量
            RelativeStageY: null,//拖动时舞台位置不为0时的相对偏移量
            StageMouseX: null,
            StageMouseY: null,
            StageDrag: false,//舞台是否拖动
            DragBoxItemId: null,
            DragBoxItemMouseX: null,//点击拖动时鼠标所处的位置
            DragBoxItemMouseY: null,
            DragBoxItemRelativeX: null,//鼠标点下去时itembox的绝对定位数值
            DragBoxItemRelativeY: null,//鼠标点下去时itembox的绝对定位数值
            SvgMinHeight: 40, //当svg最小为一条直线是它box的最小宽度
            SelectBoxitemId: null,
            SelectLineId: null,
            LineModel: false,//是否处于连线模式
            RightClickMenu: [],
            RightClickMenuVisible: false,
            RightClickX: 0,//鼠标右击时相对于容器的位置
            RightClickY: 0,
            RightClickOperateObject: undefined, //右击所操作的对象
            RightClickCopyObject: {},
            AddBoxitemModal: false,
            AddBoxitemName: ''
        }
    }
    listenWheel = (event) => {
        //监听舞台缩放
        let { StageScale } = this.state
        if (event.ctrlKey === true || event.metaKey) {
            if (event.deltaY < 0) {
                // 放大
                StageScale = StageScale + 0.1
            } else if (event.deltaY > 0) {
                // 缩小
                if (StageScale < 0.1 && StageScale > 0) {
                    StageScale = StageScale - 0.02
                } else {
                    StageScale = StageScale - 0.1
                }
                if (StageScale <= 0.01) {
                    StageScale = 0.01
                }
            }
            this.setState({
                StageScale: StageScale
            })
            event.preventDefault()
        }
    }
    keyboardListen = (event) => {
        if ((event.ctrlKey === true || event.metaKey === true)
            && (event.which === 61 || event.which === 107
                || event.which === 173 || event.which === 109
                || event.which === 187 || event.which === 189)) {
            if (event.which === 61 || event.which === 187 || event.which === 107) {
                this.zoomInStageScale()
            }else if(event.which === 173 || event.which === 189 || event.which === 109){
                this.zoomOutStageScale()
            }
            event.preventDefault()
        }
    }
    zoomInStageScale = () => {
        let { StageScale } = this.state
        StageScale = StageScale * 2
        if (StageScale >= 16) {
            StageScale = 16
        }
        this.setState({
            StageScale: StageScale
        })
    }
    zoomOutStageScale = () => {
        let { StageScale } = this.state
        StageScale = StageScale / 2
        if (StageScale <= 0.01) {
            StageScale = 0.01
        }
        this.setState({
            StageScale: StageScale
        })
    }
    stageMouseDown = (event) => {
        const { StageX, StageY } = this.state
        this.setState({
            StageDrag: true,
            RelativeStageX: StageX,
            RelativeStageY: StageY,
            StageMouseX: event.clientX,
            StageMouseY: event.clientY
        })
    }
    stageMouseUp = () => {
        this.setState({
            StageDrag: false,
            StageMouseX: null,
            StageMouseY: null,
            DragBoxItemId: -1
        })
    }
    stageMouseMove = (event) => {
        const { StageDrag, StageMouseX, StageMouseY, RelativeStageX, RelativeStageY, DragBoxItemId } = this.state
        let StageX
        let StageY
        if (DragBoxItemId !== -1) {
            // console.log('子元素冒泡事件')
            this.boxitemRender(DragBoxItemId, event)
            return
        }
        if (StageDrag) {
            StageX = event.clientX - StageMouseX + RelativeStageX
            StageY = event.clientY - StageMouseY + RelativeStageY
            this.setState({
                StageX,
                StageY
            })
        }
    }
    boxitemMouseDown = (id, event) => {
        const { BoxList } = this.state
        BoxList.map((item) => {
            if (item.id === id) {
                this.setState({
                    DragBoxItemId: id,
                    DragBoxItemMouseX: event.clientX,
                    DragBoxItemMouseY: event.clientY,
                    DragBoxItemRelativeX: item.left,
                    DragBoxItemRelativeY: item.top,
                })
            }
            return null
        })
        event.stopPropagation()
    }
    boxitemMouseUp = (event) => {
        // this.setState({
        //     DragBoxItemId: -1
        // })
        // event.stopPropagation()
    }
    boxitemMouseMove = (id, event) => {
        // this.boxitemRender(id, event)
        // event.stopPropagation()
    }
    boxitemRender = (id, event) => {
        let { DragBoxItemId, BoxList, DragBoxItemMouseX, DragBoxItemMouseY, DragBoxItemRelativeX, DragBoxItemRelativeY, StageScale } = this.state
        BoxList.map((item) => {
            if (DragBoxItemId === id && DragBoxItemId === item.id) {
                item.top = (event.clientY - DragBoxItemMouseY) / StageScale + DragBoxItemRelativeY //这里除去缩放比例是为了弥补缩放时正常鼠标移动距离与缩放后视觉的距离的差异
                item.left = (event.clientX - DragBoxItemMouseX) / StageScale + DragBoxItemRelativeX
                // console.log(item)
            }
            return null
        })
        this.setState({
            BoxList: BoxList
        })
    }
    lineBoxRender = (item) => {
        let { BoxList } = this.state
        let LineBoxStyle = {}
        let ParentBox
        let ChildBox
        BoxList.map((boxitem) => {
            if (boxitem.id === item.parent_id) {
                ParentBox = boxitem
            }
            if (boxitem.id === item.child_id) {
                ChildBox = boxitem
            }
            return null
        })
        if (ParentBox && ChildBox) {
            let width, height, left, top
            let BoxOffset = this.state.SvgMinHeight
            let lineSence = 0 //这个变量是用来判断svg线条是夹在上下间还是左右间 1:左右 2：上下
            if (!(ParentBox.left > (ChildBox.left + ChildBox.width)
                || ChildBox.left > (ParentBox.left + ParentBox.width)
                || ChildBox.top > (ParentBox.top + ParentBox.height)
                || ParentBox.top > (ChildBox.top + ChildBox.height))) {
                //元素重叠是取消绘制线条
                return null
            } else if (ParentBox.left > ChildBox.left + ChildBox.width || ChildBox.left > ParentBox.left + ParentBox.width) {
                width =
                    ParentBox.left > ChildBox.left ?
                        ParentBox.left - ChildBox.width - ChildBox.left
                        : ChildBox.left - ParentBox.width - ParentBox.left

                height = Math.abs(ChildBox.top - ParentBox.top)
                left =
                    ParentBox.left < ChildBox.left ?
                        ParentBox.left + ParentBox.width
                        : ChildBox.left + ChildBox.width
                top =
                    ParentBox.top < ChildBox.top ?
                        ParentBox.top + ParentBox.height / 2
                        : ChildBox.top + ChildBox.height / 2
                // console.log('one sence')
                height += BoxOffset
                top -= BoxOffset / 2
                lineSence = 1
            } else if (ParentBox.left < ChildBox.left + ChildBox.width || ChildBox.left < ParentBox.left + ParentBox.width) {
                width = Math.abs(ChildBox.left - ParentBox.left)
                height =
                    ParentBox.top > ChildBox.top ?
                        ParentBox.top - ChildBox.height - ChildBox.top
                        : ChildBox.top - ParentBox.height - ParentBox.top
                left =
                    ParentBox.left < ChildBox.left ?
                        ParentBox.left + ParentBox.width / 2
                        : ChildBox.left + ChildBox.width / 2
                top =
                    ParentBox.top < ChildBox.top ?
                        ParentBox.top + ParentBox.height
                        : ChildBox.top + ChildBox.height
                // console.log('two sence')
                width += BoxOffset
                left -= BoxOffset / 2
                lineSence = 2
            }


            LineBoxStyle = {
                width: width,
                height: height,
                top: top,
                left: left
            }
            return (
                <div
                    key={item.id}
                    className="line_box"
                    style={LineBoxStyle}
                >
                    {this.lineSvgRender(LineBoxStyle, ParentBox, ChildBox, lineSence, item)}
                </div>
            )
        } else {
            return null
        }

    }
    lineSvgRender = (BoxStyle, ParentBox, ChildBox, lineSence, LineItem) => {
        // lineSence1:左右 2：上下
        let width = BoxStyle.width
        let height = BoxStyle.height
        let startPointX, startPointY, endPointX, endPointY
        let PointOffset = this.state.SvgMinHeight / 2
        let ArrowDistance = PointOffset / 2 //箭头指向子元素的间距
        let PTopC = ParentBox.top + ParentBox.height / 2 < ChildBox.top + ChildBox.height / 2 //父元素是否高于子元素
        let PLeftC = ParentBox.left + ParentBox.width / 2 < ChildBox.left + ChildBox.width / 2 //父元素是否左于子元素
        if (PTopC && PLeftC) {
            // console.log('父元素位于子元素左上')
            if (lineSence === 1) {
                startPointX = 0
                startPointY = 0 + PointOffset
                endPointX = width - ArrowDistance
                endPointY = height - PointOffset
            } else if (lineSence === 2) {
                startPointX = 0 + PointOffset
                startPointY = 0
                endPointX = width - PointOffset
                endPointY = height - ArrowDistance
            }
        } else if (PTopC && !PLeftC) {
            // console.log('父元素位于子元素右上')
            if (lineSence === 1) {
                startPointX = width
                startPointY = PointOffset
                endPointX = 0 + ArrowDistance
                endPointY = height - PointOffset
            } else if (lineSence === 2) {
                startPointX = width - PointOffset
                startPointY = 0
                endPointX = 0 + PointOffset
                endPointY = height - ArrowDistance
            }
        } else if (!PTopC && PLeftC) {
            // console.log('父元素位于子元素左下')
            if (lineSence === 1) {
                startPointY = height - PointOffset
                startPointX = 0
                endPointX = width - ArrowDistance
                endPointY = 0 + PointOffset
            } else if (lineSence === 2) {
                startPointY = height
                startPointX = 0 + PointOffset
                endPointX = width - PointOffset
                endPointY = 0 + ArrowDistance
            }
        } else if (!PTopC && !PLeftC) {
            // console.log('父元素位于子元素右下')
            if (lineSence === 1) {
                startPointY = height - PointOffset
                startPointX = width
                endPointX = 0 + ArrowDistance
                endPointY = 0 + PointOffset
            } else if (lineSence === 2) {
                startPointY = height
                startPointX = width - PointOffset
                endPointX = 0 + PointOffset
                endPointY = 0 + ArrowDistance
            }
        }

        let path
        if (lineSence === 1) {
            path = `M${startPointX} ${startPointY} C ${endPointX} ${startPointY}, ${startPointX} ${endPointY} ,${endPointX} ${endPointY} `
        } else if (lineSence === 2) {
            path = `M${startPointX} ${startPointY} C ${startPointX} ${endPointY}, ${endPointX} ${startPointY} ,${endPointX} ${endPointY} `
        }
        let { SelectLineId } = this.state
        return (
            <svg width="100%" height="100%">
                <path
                    className={`${SelectLineId === LineItem.id ? 'selected' : ''} line_body`}
                    onClick={this.selectLine.bind(this, LineItem)}
                    d={path}
                    strokeWidth='4px'
                    fill='none'
                    onContextMenu={this.rightClickLine.bind(this, LineItem)}
                ></path>
            </svg>
        )
    }

    selectLine = (LineItem, event) => {
        this.setState({
            SelectLineId: LineItem.id
        })
        event.stopPropagation()
    }
    confirmAddBoxitem = () => {
        let { AddBoxitemName } = this.state
        let id = `boxitem_${nowTimestamp}_${BoxCount}`
        let { BoxList } = this.state
        BoxList.push({
            id: id,
            left: document.documentElement.clientWidth * Math.random(),
            top: document.documentElement.clientHeight * Math.random(),
            width: 200,
            height: 150,
            title: AddBoxitemName,
            type: 'box'
        })
        BoxCount++
        this.setState({
            BoxList
        })
        this.hideAddBoxitemModal()
    }
    showAddBoxitemModal = () => {
        this.setState({
            AddBoxitemModal: true
        })
    }
    hideAddBoxitemModal = () => {
        this.setState({
            AddBoxitemModal: false,
            AddBoxitemName: ''
        })
    }
    inputChange = (key, e) => {
        this.setState({
            [key]: e.target.value
        })
    }
    selectBoxItem = (id, event) => {
        this.setState({
            SelectBoxitemId: id
        })
        this.addLineToBoxitem(id)
        event.stopPropagation()
    }
    cancelSelectedBoxItem = () => {
        this.setState({
            SelectBoxitemId: null,
            SelectLineId: null
        })
    }
    clickStageBlank = () => {
        //点击整个舞台空白处
        this.cancelSelectedBoxItem()
        this.hideRightClickMenu()
    }
    addLineToBoxitem = (child_id) => {
        let { LineModel, SelectBoxitemId, LineList } = this.state
        if (!SelectBoxitemId || !LineModel) {
            return
        }
        if (child_id !== SelectBoxitemId) {
            let IsExist = false //2个元素间是否已经存在这样的连线
            LineList.map((item) => {
                if ((item.parent_id === SelectBoxitemId && item.child_id === child_id) || (item.parent_id === child_id && item.child_id === SelectBoxitemId)) {
                    IsExist = true
                }
                return null
            })
            if (IsExist) {
                return
            }
            LineList.push({
                id: `line_${nowTimestamp}_${LineCount++}`,
                parent_id: SelectBoxitemId,
                child_id: child_id,
                type: 'line'
            })
            this.setState({
                LineList: LineList
            })
        }
    }
    switchLineModel = () => {
        //切换连线模式
        let { LineModel } = this.state
        this.setState({
            LineModel: !LineModel
        })
    }
    showRightClickMenu = (event) => {
        // console.log(event)
        event.preventDefault()
        this.setState({
            RightClickX: event.clientX,
            RightClickY: event.clientY,
            RightClickMenuVisible: true
        })
    }
    hideRightClickMenu = () => {
        this.setState({
            RightClickMenuVisible: false
        })
    }
    renderRightClickMenu = () => {
        const { RightClickMenu } = this.state
        let menu = (
            <Menu>
                {
                    RightClickMenu.map((item) => {
                        return (
                            <Menu.Item key={item.type} onClick={this.rightClickOperate.bind(this, item)}>
                                <div className={`${item.disable ? 'disable' : ''}`}>
                                    {item.title}
                                </div>
                            </Menu.Item>
                        )
                    })
                }
            </Menu>
        )
        return menu
    }
    rightClickOperate = (item, event) => {
        let { RightClickOperateObject } = this.state
        let type = item.type
        if (item.disable) {
            return
        }
        if (RightClickOperateObject) {
            if (RightClickOperateObject.type === 'line') {
                switch (type) {
                    case 'delete':
                        this.deleteLine(RightClickOperateObject)
                        break
                    default:
                        break
                }
            } else if (RightClickOperateObject.type === 'box') {
                switch (type) {
                    case 'delete':
                        this.deleteBoxitem(RightClickOperateObject)
                        break
                    case 'copy':
                        this.copyBoxitem(RightClickOperateObject)
                    case 'edit':
                        this.editBoxitem(RightClickOperateObject)
                    default:
                        break
                }
            }

        } else {
            //点击舞台空白处
            switch (type) {
                case 'paste':
                    this.pasteBoxitem(event.domEvent)
                    break
                default:
                    break
            }
        }
        this.hideRightClickMenu()
    }
    deleteBoxitem = (Boxitem) => {
        let { BoxList, LineList } = this.state
        BoxList = BoxList.filter((item) => { return item.id !== Boxitem.id })
        LineList = LineList.filter((item) => { return item.parent_id !== Boxitem.id && item.child_id !== Boxitem.id })//删除与删除元素相关的line
        this.setState({
            BoxList: BoxList,
            LineList: LineList
        })
    }
    copyBoxitem = (Boxitem) => {
        let RightClickCopyObject = { ...Boxitem } //右击复制对象
        RightClickCopyObject.title = `${RightClickCopyObject.title} 副本`
        RightClickCopyObject.id = `boxitem_${nowTimestamp}_${BoxCount++}`
        this.setState({
            RightClickCopyObject: RightClickCopyObject
        })
    }
    editBoxitem = (Boxitem) => {

    }
    pasteBoxitem = (event) => {
        let { RightClickCopyObject, BoxList } = this.state
        RightClickCopyObject.left = event.clientX
        RightClickCopyObject.top = event.clientY
        BoxList.push(RightClickCopyObject)
        this.setState({
            RightClickCopyObject: {},
            BoxList: BoxList
        })
    }
    deleteLine = (LineItem) => {
        let { LineList } = this.state
        LineList = LineList.filter((item) => { return item.id !== LineItem.id })
        this.setState({
            LineList: LineList
        })
    }
    rightClickLine = (LineItem, event) => {
        this.setState({
            RightClickOperateObject: LineItem,
            RightClickMenu: [{ type: 'delete', title: '删除', disable: false }]
        })
        this.showRightClickMenu(event)
        event.stopPropagation()
        event.preventDefault()
    }
    rightClickBoxitem = (Boxitem, event) => {
        this.setState({
            RightClickOperateObject: Boxitem,
            RightClickMenu: [{ type: 'delete', title: '删除', disable: false }, { type: 'copy', title: '复制', disable: false }, { type: 'edit', title: '编辑', disable: false }]
        })
        this.showRightClickMenu(event)
        event.stopPropagation()
        event.preventDefault()
    }
    rightClickStageBlank = (event) => {

        let { RightClickCopyObject } = this.state
        let disable = RightClickCopyObject.id ? false : true

        this.setState({
            RightClickOperateObject: undefined,
            RightClickMenu: [{ type: 'paste', title: '黏贴', disable: disable }]
        })
        this.showRightClickMenu(event)
    }
    render() {
        const {
            BoxList,
            LineList,
            StageScale,
            StageX,
            StageY,
            SelectBoxitemId,
            LineModel,
            RightClickMenuVisible,
            RightClickX,
            RightClickY,
            AddBoxitemModal,
            AddBoxitemName
        } = this.state
        return (
            <div className="mind" onWheel={this.listenWheel}>
                <div className="container"
                    onMouseDown={this.stageMouseDown}
                    onMouseUp={this.stageMouseUp}
                    onMouseMove={this.stageMouseMove}
                    onKeyDown={this.keyboardListen}
                    tabIndex={0}
                >
                    <div className="tool_nav">
                        <div className={`tool_item ${LineModel ? 'active' : ''}`} onClick={this.switchLineModel} >
                            <div className="tool_line tool_icon">
                            </div>
                        </div>
                        <div className="tool_item" onClick={this.showAddBoxitemModal} >
                            <div className="tool_add tool_icon">
                            </div>
                        </div>
                        <div className="operate_zoom">
                            <div className="tool_item" onClick={this.zoomOutStageScale}>
                                <div className="tool_zoomout tool_icon">
                                </div>
                            </div>
                            <div className="scale_data">
                                {(StageScale * 100).toFixed(0)}%
                            </div>
                            <div className="tool_item" onClick={this.zoomInStageScale} >
                                <div className="tool_zoomin tool_icon">
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 舞台主要内容开始 */}
                    <div className="stage" onClick={this.clickStageBlank} onContextMenu={this.rightClickStageBlank} >
                        <div className="stage_base" style={{ transform: `matrix(${StageScale},0,0,${StageScale},${StageX},${StageY})` }}>
                            <div className="box_wrapper">
                                {
                                    BoxList.map((item) => {
                                        return (
                                            <div
                                                key={item.id}
                                                className={`box_item ${SelectBoxitemId === item.id ? 'box_item_selected' : ''}`}
                                                style={{ top: `${item.top}px`, left: `${item.left}px`, width: `${item.width}px`, height: `${item.height}px` }}
                                                onMouseDown={this.boxitemMouseDown.bind(this, item.id)}
                                                onMouseUp={this.boxitemMouseUp}
                                                onMouseMove={this.boxitemMouseMove.bind(this, item.id)}
                                                onClick={this.selectBoxItem.bind(this, item.id)}
                                                onContextMenu={this.rightClickBoxitem.bind(this, item)}
                                            >
                                                {item.title}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="line_def">
                                <svg>
                                    <defs>
                                        <marker id="Triangle" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="6" markerHeight="4" fill="#acacac" orient="auto">
                                            <path d="M 0 0 L 10 5 L 0 10 z" style={{ strokeDasharray: '0,0' }}></path>
                                        </marker>
                                        <marker id="TriangleSelect" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="6" markerHeight="4" fill="#2878FF" orient="auto">
                                            <path d="M 0 0 L 10 5 L 0 10 z" style={{ strokeDasharray: '0,0' }}></path>
                                        </marker>
                                        <marker id="TriangleHover" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="6" markerHeight="4" fill="#7EAEFF" orient="auto">
                                            <path d="M 0 0 L 10 5 L 0 10 z" style={{ strokeDasharray: '0,0' }}></path>
                                        </marker>
                                    </defs>
                                </svg>
                            </div>
                            <div className="line_wrapper">
                                {
                                    LineList.map((item) => {
                                        return this.lineBoxRender(item)
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    {/* 舞台主要内容结束 */}
                    <div className="right_click_menu" style={{ top: RightClickY, left: RightClickX }}>
                        <Dropdown
                            overlay={this.renderRightClickMenu()}
                            visible={RightClickMenuVisible}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                        >
                            <div></div>
                        </Dropdown>
                    </div>
                    <Modal
                        title="添加新元素"
                        visible={AddBoxitemModal}
                        onCancel={this.hideAddBoxitemModal}
                        onOk={this.confirmAddBoxitem}
                        getContainer={() => document.querySelector('.mind')}
                    >
                        <div className="add_wrapper">
                            <div className="form_item">
                                <div className="form_name">
                                    名称：
                                    </div>
                                <div className="form_value">
                                    <Input value={AddBoxitemName} type="text" onChange={this.inputChange.bind(this, 'AddBoxitemName')} />
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }
}
export default Mind