// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Ball extends cc.Component {

    isMoving: boolean;

    isTapped: boolean;
    tapTime: number;

    body: cc.RigidBody;

    @property(cc.Node)
    Platform: cc.Node = null;

    onLoad() {
        this.Platform.on('moved', this.onPlatformMoved, this);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchstart, this);

        this.body = this.node.getComponent(cc.RigidBody);
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
                this.runBall();
            } else {
                this.tapTime = time
            }
        }
    }
    onKeyDown(event: KeyboardEvent) {
        if (!this.isMoving && (event.keyCode === cc.macro.KEY.enter || event.keyCode === cc.macro.KEY.space)) {
            this.runBall();
        }
    }
    onPlatformMoved(pos: number) {
        if (!this.isMoving) {
            this.node.x = pos;
        }
    }

    resetBall(){
        this.body.linearVelocity = cc.v2(0,0)
        this.isMoving = false;
        this.node.runAction(cc.moveTo(0, this.Platform.x, -870));
    }

    runBall() {
        this.isMoving = true;
        this.body.linearVelocity = cc.v2(500, 1000);
    }

    start() {

    }

    update(){
        if(!this.isMoving){
            this.node.y = -870;
        }
    }

    onBeginContact(contact: cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider) {
        if(other.node.name === 'bottom_wall') {
            this.resetBall();
        }
    }
}
