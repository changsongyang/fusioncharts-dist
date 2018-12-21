import Path from'./path';import constant from'../../../fc-core/src/axis/utils/constant';import CurveLinear from'./curve-factories/linear';import Line from'./line-generator';class AreaGenerator{constructor(){this.xTopAccessor=a=>a[0],this.xBaseAccessor=null,this.yTopAccessor=constant(0),this.yBaseAccessor=a=>a[1],this.isDefined=constant(!0),this.Curve=CurveLinear,this.ctx=null,this._output=null}generate(a=[]){let b,c,e,f,g,h=a.length,l=!1,m=Array(h),n=Array(h);for((null===this.ctx||'undefined'==typeof this.ctx)&&(g=new Path,this._output=new this.Curve(g)),b=0;b<=h;++b){if(f=a[b],!(b<h&&this.isDefined(f,b,a))==l)if(l=!l,l)c=b,this._output.areaStart(),this._output.lineStart();else{for(this._output.lineEnd(),this._output.lineStart(),e=b-1;e>=c;--e)this._output.point(m[e],n[e]);this._output.lineEnd(),this._output.areaEnd()}l&&(m[b]=+this.xTopAccessor(f,b,a),n[b]=+this.yTopAccessor(f,b,a),this._output.point(this.xBaseAccessor?+this.xBaseAccessor(f,b,a):m[b],this.yBaseAccessor?+this.yBaseAccessor(f,b,a):n[b]))}if(g)return this._output=null,g.toString()||null}setXAccessor(a=a=>a[0]){return this.xTopAccessor='function'==typeof a?a:constant(+a),this.xBaseAccessor=null,this}getXAccessor(){return this.xTopAccessor}setXTopAccessor(a=a=>a[0]){return this.xTopAccessor='function'==typeof a?a:constant(+a),this}getXTopAccessor(){return this.xTopAccessor}setXBaseAccessor(a){return this.xBaseAccessor=null===a||'undefined'==typeof a?null:'function'==typeof a?a:constant(+a),this}getXBaseAccessor(){return this.xBaseAccessor}setYAccessor(a=a=>a[1]){return this.yTopAccessor='function'==typeof a?a:constant(+a),this.yBaseAccessor=null,this}getYAccessor(){return this.yTopAccessor}setYTopAccessor(a=a=>a[1]){return this.yTopAccessor='function'==typeof a?a:constant(+a),this}getYTopAccessor(){return this.yTopAccessor}setYBaseAccessor(a){return this.yBaseAccessor=null===a||'undefined'==typeof a?null:'function'==typeof a?a:constant(+a),this}getYBaseAccessor(){return this.yBaseAccessor}setDefined(a=constant(!0)){return this.isDefined='function'==typeof a?a:constant(!!a),this}getDefined(){return this.isDefined}setCurve(a=CurveLinear){return this.Curve=a,null!==this.ctx&&'undefined'!=typeof this.ctx&&(this._output=new this.Curve(this.ctx)),this}getCurve(){return this.Curve}setContext(a){return null===a||'undefined'==typeof a?(this.ctx=null,this._output=this._ctx):(this.ctx=a,this._output=new this.Curve(this.ctx)),this}getContext(){return this.ctx}_areaLine(){return new Line().setDefined(this.isDefined).setCurve(this.Curve).setContext(this.ctx)}getLineXBase(){return this._areaLine().setXAccessor(this.xTopAccessor).setYAccessor(this.yTopAccessor)}getLineYBase(){return this._areaLine().setXAccessor(this.xTopAccessor).setYAccessor(this.yTopAccessor)}getLineYTop(){return this._areaLine().setXAccessor(this.xTopAccessor).setYAccessor(this.yTopAccessor)}getLineXTop(){return this._areaLine().setXAccessor(this.xBaseAccessor).setYAccessor(this.yBaseAccessor)}}export default AreaGenerator;