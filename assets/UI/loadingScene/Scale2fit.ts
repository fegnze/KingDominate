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
export default class scale2fit extends cc.Component {

    @property({displayName: "适配宽度"})
    width: boolean = false;

    @property({displayName: "适配高度"})
    height: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var designSize = cc.size(750,1334);
        var winSize = cc.winSize;
        var designrate = designSize.height / designSize.width;
        var winrate = winSize.height / winSize.width;
        var rate = winrate / designrate;
        var node = this.node;

        if (this.width){
            node.scaleX = node.scaleX * rate;
            node.position.x = node.position.x * rate; 
        }
        if (this.height){
            node.scaleY = node.scaleY * rate;
            node.position.y = node.position.y * rate;
        }

    }

    start () {

    }

    // update (dt) {}
}
