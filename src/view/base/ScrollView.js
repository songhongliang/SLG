/**
 * User: zhoufei
 * Date: 13-5-29
 * Time: 下午6:06
 * Class:
 */
puremvc.define
(
    // CLASS INFO
    {
        name:'app.view.base.ScrollView',
        /**
         * @constructor
         * @param render    回调方法
         * @param   cw       container's width
         * @param   ch       container's height
         * @param   w      target's width
         * @param   h      target's height
         * @param   target  draged target
         */
        constructor:function (render, cw, ch, w, h, target, data) {

            var me = this;

            if (target == null) target = app.GameData.topCanvas;

            this.target = target;

            var param = {zooming:false, bouncing:false};
            for (var p in data) param[p] = data[p];

            this.scroller = new Scroller(render, param);
            this.scroller.setDimensions(cw, ch, w, h);
            this.scroller.setPosition(0, 0);

            if (isXc||createjs.Touch.isSupported()) {
                this.tochStartHandler = function (e) {
                    if(isXc) e.timeStamp=new Date().getTime();
                    me.scroller.doTouchStart(e.touches, e.timeStamp);
                    e.preventDefault();
                };
                target.addEventListener("touchstart", this.tochStartHandler, false);

                this.touchMoveHandler = function (e) {
                    if(isXc) e.timeStamp=new Date().getTime();
                    me.scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
                }
                target.addEventListener("touchmove", this.touchMoveHandler, false);

                this.touchEndHandler = function (e) {
                    if(isXc) e.timeStamp=new Date().getTime();
                    me.scroller.doTouchEnd(e.timeStamp);
                };
                target.addEventListener("touchend", this.touchEndHandler, false);

                target.addEventListener("touchcancel", this.touchEndHandler, false);
            } else {
                this.mousedown = false;
                this.mouseDownHandler = function (e) {
                    me.scroller.doTouchStart([
                        {
                            pageX:e.pageX,
                            pageY:e.pageY
                        }
                    ], e.timeStamp);

                    me.mousedown = true;
                    //e.preventDefault();
                };
                target.addEventListener('mousedown', this.mouseDownHandler);

                this.mouseMoveHandler = function (e) {
                    if (!me.mousedown) {
                        return;
                    }
                    me.scroller.doTouchMove([
                        {
                            pageX:e.pageX,
                            pageY:e.pageY
                        }
                    ], e.timeStamp);

                    me.mousedown = true;
                };
                target.addEventListener("mousemove", this.mouseMoveHandler);

                this.mouseUpHandler = function (e) {
                    if (!me.mousedown) {
                        return;
                    }
                    me.scroller.doTouchEnd(e.timeStamp);
                    me.mousedown = false;
                };
                target.addEventListener('mouseup', this.mouseUpHandler);
            }
        }
    },

   // INSTANCE MEMBERS
    {
        /**
         * @private
         * @type {Scroller}
         */
        scroller:null,

        /**
         * 更新
         */
        update:function (cw, ch, w, h) {
            this.scroller.setDimensions(cw, ch, w, h);
            this.scroller.setPosition(0, 0);
        },

        depose:function () {
            if (createjs.Touch.isSupported()) {
                this.target.removeEventListener("touchstart", this.tochStartHandler, false);
                this.target.removeEventListener("touchmove", this.touchMoveHandler, false);
                this.target.removeEventListener("touchend", this.touchEndHandler, false);
                this.target.removeEventListener("touchcancel", this.touchEndHandler, false);
                this.target = null;
                this.tochStartHandler = null;
                this.touchMoveHandler = null;
                this.touchEndHandler = null;
            } else {
                this.target.removeEventListener('mousedown', this.mouseDownHandler);
                this.target.removeEventListener("mousemove", this.mouseMoveHandler);
                this.target.removeEventListener('mouseup', this.mouseUpHandler);
                this.target = null;
                this.mouseDownHandler = null;
                this.mouseMoveHandler = null;
                this.mouseUpHandler = null;
            }
        }
    }
);