// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

enum eMoveDirection {
    left = -1,
    idle = 0,
    right = 1
}

@ccclass
export default class Platform extends cc.Component {

    side: eMoveDirection = eMoveDirection.idle;
    moving: boolean = false;
    x: number;

    maxPos: number;
    minPos: number;

    @property
    Delta: number = 5;

    watchPositions() {
        this.maxPos = this.node.parent.width / 2 - this.node.width / 2;
        this.minPos = - this.node.parent.width / 2 + this.node.width / 2;
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.watchPositions();
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        const canvas = this.node.parent;

        canvas.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        canvas.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        canvas.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        canvas.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        const canvas = this.node.parent;

        canvas.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        canvas.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        canvas.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        canvas.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    onTouchStart(event: cc.Touch) {
        this.moving = true;
        this.x = this.node.x;
    }

    onTouchEnd(event: cc.Touch) {
        this.moving = false;
    }

    onTouchCancel(event: cc.Touch) {
        this.moving = false;
    }

    onTouchMove(event: cc.Touch) {
        if (!this.moving) {
            return;
        }

        this.x += event.getDelta().x;
    }

    onKeyUp(event: KeyboardEvent) {
        if (event.keyCode == cc.macro.KEY.left || event.keyCode == cc.macro.KEY.right) {
            this.side = eMoveDirection.idle;
        }
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.keyCode == cc.macro.KEY.left) {
            this.side = eMoveDirection.left;
        } else if (event.keyCode == cc.macro.KEY.right) {
            this.side = eMoveDirection.right
        }
    }

    start() {
    }

    setPosition(pos: number) {
        const newPos: number = (pos > this.maxPos) ? this.maxPos : (pos < this.minPos) ? this.minPos : pos;

        this.node.x = newPos;
        this.node.emit('moved', newPos);
    }

    updateByKey() {
        if (this.side === eMoveDirection.idle) {
            return
        }

        this.setPosition(this.node.x + this.Delta * this.side);
    }

    updateByTouch() {
        this.setPosition(this.x);
    }

    update(dt) {
        if (this.moving) {
            return this.updateByTouch();
        }

        if (this.side !== eMoveDirection.idle) {
            this.updateByKey();
        }
    }
}
