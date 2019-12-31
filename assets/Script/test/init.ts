// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class TestRootNode extends cc.Component {
    @property(cc.Layout)
    lay: cc.Layout = null;

    @property(cc.Button)
    bar: cc.Button = null;

    onLoad () {
        //设置常住节点
        cc.game.addPersistRootNode(this.node);
        //小白点移动
        let isBarMove = false;
        this.bar.node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            var pos = event.getLocation();
            var nodepos = this.node.convertToNodeSpace(pos);
            this.bar.node.setPosition(nodepos);
            isBarMove = true;
        },this);
        //小白点点击事件
        let moving = false;
        this.node.on('onClickToolBar',(event:any) => {
            if (moving) return;
            if (isBarMove) {isBarMove = false;return;}
            var action = cc.sequence(cc.moveTo(0.2, - this.lay.node.position.x, this.lay.node.position.y), cc.callFunc(() => {
                moving = false;
            }));
            moving = true;
            this.lay.node.runAction(action);
        },this);
    }

    start () {

    }

    // update (dt) {}

    onDestroy () {
        this.node.targetOff(this);
    }
}
