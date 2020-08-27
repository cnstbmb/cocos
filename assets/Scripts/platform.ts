// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Platform extends cc.Component {

    left: boolean = false;
    right: boolean = false;
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

    onLoad () {
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
        if(event.keyCode == cc.macro.KEY.left) {
            this.left = false;
        } else if (event.keyCode == cc.macro.KEY.right) {
            this.right = false;
        }
    }

    onKeyDown(event: KeyboardEvent) {
        if(event.keyCode == cc.macro.KEY.left) {
            this.left = true;
        } else if (event.keyCode == cc.macro.KEY.right) {
            this.right = true;
        }
    }

    start () {
    }

    getDeltaByKeys(): number {
        if(this.left) {
            return -this.Delta;
        }

        if (this.right) {
            return this.Delta;
        }
    }

    updateByKey(delta: number) {
        let pos = this.node.x + delta;

        if (pos > this.maxPos) {
            pos = this.maxPos;
        } else if (pos < this.minPos) {
            pos = this.minPos;
        }

        this.node.x = pos;
    }

    updateByTouch() {
        if (this.x > this.maxPos) {
            this.x = this.maxPos;
        } else if (this.x < this.minPos) {
            this.x = this.minPos
        }

        this.node.x = this.x;
    }

    update (dt) {
        if (this.moving) {
            return this.updateByTouch();
        }
        
        if (this.left || this.right) {
            const delta = this.getDeltaByKeys();
            this.updateByKey(delta);
        }
    }
}
