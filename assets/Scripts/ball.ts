// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Ball extends cc.Component {
    vector: cc.Vec2 = new cc.Vec2(1, 2);
    isMoving: boolean;
    speed: number = 1000;

    isTapped: boolean;
    tapTime: number;

    @property(cc.Node)
    Platform: cc.Node = null;

    @property(cc.Node)
    TopWall: cc.Node = null

    @property(cc.Node)
    RightWall: cc.Node = null

    @property(cc.Node)
    BottomWall: cc.Node = null

    @property(cc.Node)
    LeftWall: cc.Node = null

    onLoad() {
        this.Platform.on('moved', this.onPlatformMoved, this);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchstart, this);
    }

    onDestroy() {
        this.Platform.off('moved', this.onPlatformMoved, this);

        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.node.parent.off(cc.Node.EventType.TOUCH_START, this.onTouchstart, this); 
    }

    onTouchstart(event: cc.Event.EventTouch) {
        if (this.isMoving || event.getTouches().length != 1) {
            return;
        }

        const time = new Date().getTime();

        if (!this.isTapped) {
            this.isTapped = true;
            this.tapTime = time;
        } else {
            const timeDelta = time - this.tapTime;
            if (timeDelta < 400) {
                this.isTapped = false;
                this.isMoving = true;
            } else {
                this.tapTime = time
            }
        }
    }
    onKeyDown(event: KeyboardEvent) {
        if (!this.isMoving && (event.keyCode === cc.macro.KEY.enter || event.keyCode === cc.macro.KEY.space)) {
            this.isMoving = true;
        }
    }
    onPlatformMoved(pos: number) {
        if (this.isMoving) {
            return;
        }

        this.node.x = pos
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        switch(other.node) {
            case this.LeftWall:
            case this.RightWall:
                this.vector.x = -this.vector.x
                break;
            case this.TopWall:
            case this.Platform:
                this.vector.y = -this.vector.y;
                break;
            case this.BottomWall:
                this.resetBall();
                break;
        }
    }

    resetBall() {
        this.isMoving = false;
        this.node.y = -870;
        this.vector = new cc.Vec2(1,2);
        this.node.x = this.Platform.x;
    }

    start() {

    }

    update(dt) {
        if(this.isMoving) {
            this.node.x += this.vector.x * dt * this.speed;
            this.node.y += this.vector.y * dt * this.speed;
        }
    }
}
