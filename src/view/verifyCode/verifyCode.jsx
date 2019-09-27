import React from 'react'
import { message } from 'antd'
import './verifyCode.scss'
import VerifyBg from '../../assets/images/verify.png'
let clipCanvas
let originCanvas
let puzzleCanvas
class VerifyCode extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            originImageDom: null,
            puzzleImageDom: null,
            buttonMoving: false,
            buttonMouseDownX: 0,
            buttonX: 0,
            puzzle: {
                top: 80,
                left: 140,
                width: 50,
                height: 50,
                offset: 10,//多少像素内偏差也算吻合
            }
        }
    }
    componentDidMount() {

        window.addEventListener('mouseup', () => {
            this.setState({
                buttonMoving: false
            })
        })
        this.initOriginImageDom(() => {
            this.initDrawClipImage()
            this.initDrawOriginImage()
            this.getPuzzleImage()
            this.testArcImage()
        })
    }
    componentWillUnmount() {
        window.removeEventListener('mouseup', function () {

        })
    }
    testArcImage = () => {
        const { originImageDom, puzzle } = this.state
        let canvas = document.querySelector('.test_canvas')
        let context = canvas.getContext('2d')
        let { left, top, width, height } = puzzle
        // context.drawImage(originImageDom, 0, 0)

        context.beginPath()
        context.moveTo(left, top)
        context.lineTo(left + width / 4, top)
        context.stroke()
        // context.beginPath()
        context.moveTo(left + width / 4 * 3, top)
        context.arc(left + width / 2, top, width / 4, 0, Math.PI)
        context.moveTo(left + width / 4 * 3, top)
        context.lineTo(left + width, top)
        context.lineTo(left + width, top + height / 4)
        context.stroke()
        context.arc(left + width, top + height / 2, width / 4, -Math.PI / 2, Math.PI / 2)
        context.moveTo(left + width, top + height / 4 * 3)
        context.lineTo(left + width, top + height)
        context.lineTo(left, top + height)
        context.lineTo(left, top + height / 4 * 3)
        context.stroke()
        // context.beginPath()
        context.moveTo(left, top + height / 4)
        context.arc(left, top + height / 2, width / 4, -Math.PI / 2, Math.PI / 2)
        context.moveTo(left, top + height / 4)
        context.lineTo(left, top)
        context.stroke()

        context.clip()

        context.drawImage(originImageDom, 0, 0)
    }
    initOriginImageDom = (callback) => {
        let image = document.createElement('img')
        image.src = VerifyBg
        image.onload = () => {
            this.setState({
                originImageDom: image
            }, () => {
                callback ? callback() : null
            })
        }
    }
    initDrawClipImage = () => {
        const { puzzle, originImageDom } = this.state
        clipCanvas = document.querySelector('.verify_canvas')
        let context = clipCanvas.getContext('2d')
        context.drawImage(originImageDom, 0, 0)
        context.clearRect(puzzle.left, puzzle.top, puzzle.width, puzzle.height)

    }
    initDrawOriginImage = () => {
        const { originImageDom } = this.state
        originCanvas = document.querySelector('.verify_canvas_origin')
        let context = originCanvas.getContext('2d')
        context.globalAlpha = 0
        context.drawImage(originImageDom, 0, 0)
    }
    drawPuzzle = (isInit) => {
        const { puzzle, puzzleImageDom, buttonX } = this.state
        puzzleCanvas = document.querySelector('.verify_canvas_puzzle')
        let context = puzzleCanvas.getContext('2d')
        context.clearRect(0, 0, 260, 195)
        let puzzleLeft
        if (isInit) {
            puzzleLeft = 0
        } else {
            puzzleLeft = buttonX
        }
        context.drawImage(puzzleImageDom, 0, 0, puzzle.width, puzzle.height, puzzleLeft, puzzle.top, puzzle.width, puzzle.height)
    }

    getPuzzleImage = () => {
        const { puzzle, originImageDom } = this.state
        puzzleCanvas = document.querySelector('.verify_canvas_puzzle')
        let context = puzzleCanvas.getContext('2d')
        context.drawImage(originImageDom, 0, 0, 260, 195)
        let puzzleImageData = context.getImageData(puzzle.left, puzzle.top, puzzle.width, puzzle.height)
        let tempCanvas = document.createElement("canvas")
        let tempContext = tempCanvas.getContext('2d')
        tempCanvas.width = puzzle.width
        tempCanvas.height = puzzle.height
        tempContext.putImageData(puzzleImageData, 0, 0)
        let dataURL = tempCanvas.toDataURL("image/png")
        let puzzleImageDom = document.createElement('img')
        puzzleImageDom.src = dataURL
        this.setState({
            puzzleImageDom: puzzleImageDom
        }, () => {
            this.drawPuzzle(true)
        })
    }
    verifyPosition = () => {
        const { puzzle, buttonX } = this.state
        if ((puzzle.left - puzzle.offset) < buttonX && buttonX < (puzzle.left + puzzle.offset)) {
            message.success('成功啦')
        } else {
            message.error('错位啦')
            this.resetPuzzlePosition()
        }
    }
    resetPuzzlePosition = () => {
        this.setState({
            buttonX: 0
        })
        this.drawPuzzle(true)
    }
    slideButtonMouseDown = (event) => {

        this.setState({
            buttonMoving: true,
            buttonMouseDownX: event.clientX
        })
    }
    slideButtonMouseUp = () => {
        this.setState({
            buttonMoving: false
        })
        this.verifyPosition()
    }
    slideButtonMouseMove = (event) => {
        let { buttonMoving, buttonMouseDownX, buttonX } = this.state
        if (buttonMoving) {
            let distant = event.clientX - buttonMouseDownX
            buttonX = distant + buttonX
            if (buttonX < 0 || buttonX > 215) {
                return
            }
            this.setState({
                buttonX: buttonX,
                buttonMouseDownX: event.clientX
            })
            this.drawPuzzle()
        }
    }
    render() {
        const { buttonX, buttonMoving } = this.state
        return (
            <div className="verify_main">
                <div className="verify_container">
                    <div className="verify_box">
                        <canvas className="verify_canvas" width="260px" height="195px" ></canvas>
                        <canvas className="verify_canvas_origin" width="260px" height="195px" ></canvas>
                        <canvas className="verify_canvas_puzzle" width="260px" height="195px" ></canvas>
                    </div>
                    <div className="verify_slide">
                        <div className={`verify_slide_button ${buttonMoving ? 'active_button' : ''}`}
                            style={{ transform: `translate(${buttonX}px, 0)` }}
                            onMouseDown={this.slideButtonMouseDown}
                            onMouseMove={this.slideButtonMouseMove}
                            onMouseUp={this.slideButtonMouseUp}
                        ></div>
                    </div>
                    <div className="verify_operate"></div>
                </div>
                <canvas className="test_canvas" width="260px" height="195px" ></canvas>
            </div>
        )
    }
}
export default VerifyCode