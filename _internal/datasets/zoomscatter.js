import Scatter from'./scatter';import KdTree from'../misc/kdtree';import{priorityList}from'../schedular';import{parseTooltext,BLANKSTRING,pluck,pluckNumber,getFirstValue,toRaphaelColor,HUNDREDSTRING,hasSVG,isIE,parseUnsafeString,getValidValue,preDefStr}from'../lib/lib';import{HEXtoRGB,getFirstColor}from'../lib/lib-graphics';import getLinearRegressionPoints from'../../features/regression-extension/linear-regression';var UNDEF,win=window,hideFn=function(){this.hide()},POINTER='pointer',pi=Math.PI,DEFAULT_CURSOR=preDefStr.DEFAULT,pi2=2*pi,COLOR_WHITE='#FFFFFF',sameSign=function(c,a){return 0<=c*a},lineIntersect=function(a,b,c,d,e,f,g,h){var i,j,k,l,m,n,o,p,q,r,s;return(i=d-b,k=a-c,m=c*b-a*d,q=i*e+k*f+m,r=i*g+k*h+m,0!==q&&0!==r&&sameSign(q,r))?0:(j=h-f,l=e-g,n=g*f-e*h,o=j*a+l*b+n,p=j*c+l*d+n,0!==o&&0!==p&&sameSign(o,p))?0:(s=i*l-j*k,0===s?1:1)},lineIntersectsGrid=function(c,a,b){return isNaN(c.x)||isNaN(c.y)||isNaN(a.x)||isNaN(a.y)?void 0:lineIntersect(c.x,c.y,a.x,a.y,b.xMinWPad,b.yMaxWPad,b.xMaxWPad,b.yMaxWPad)||lineIntersect(c.x,c.y,a.x,a.y,b.xMaxWPad,b.yMaxWPad,b.xMaxWPad,b.yMinWPad)||lineIntersect(c.x,c.y,a.x,a.y,b.xMaxWPad,b.yMinWPad,b.xMinWPad,b.yMinWPad)},getVisibilityRatio=function(a){var b=(a.config.axisRange.max-a.config.axisRange.min)/(a.getVisibleConfig().maxValue-a.getVisibleConfig().minValue);return b=Math.round(1e3*b)/1e3,b},numberNeighbours=function(a){return[a-1,a,a+1]},inRange=function(d,a,b){return d>=a&&d<=b},inRangeMod=function(d,a,b){return inRange(d,a,b)||inRange(d,b,a)},getFillColor=function(a,b){return b=parseFloat(b/100),0>b?b=0:1<b&&(b=1),a||(a=COLOR_WHITE),isIE&&!hasSVG?b?a:'transparent':(a=a.replace(/^#?([a-f0-9]+)/ig,'$1'),a=HEXtoRGB(a),a[3]=b.toString(),'rgba('+a.join(',')+')')},getVisibleGridsIndex=function(a){var b,c,d=[],e=a.getVisibleConfig(),f=e.maxValue-e.minValue,g=e.minValue+f/2,h=a.config,i=h.axisRange;return b=Math.abs((g-(h.isReverse?i.max:i.min))/f),c=d.focusedGrid=Math.floor(b),d.push(c),.5<b%1?d.push(c+1):.5>b%1&&d.unshift(c-1),d};class ZoomScatter extends Scatter{getType(){return'dataset'}getName(){return'zoomScatter'}configureAttributes(a){super.configureAttributes(a);var b,c,d,e,f,g,h,i=this,j=i.config,k=i.getFromEnv('chart'),l=k.config,m=k.getFromEnv('dataSource').chart,n=pluck(a.anchorbordercolor,m.anchorbordercolor),o=getFirstColor(pluck(n,j.plotBorderColor)),p=pluckNumber(a.anchorborderthickness,m.anchorborderthickness,n?1:0),q=getFirstColor(pluck(a.anchorbgcolor,a.color,m.anchorbgcolor,j.plotColor)),r=pluck(a.anchoralpha,a.alpha,m.anchoralpha,HUNDREDSTRING),s=pluck(a.anchorbgalpha,a.alpha,m.anchorbgalpha,HUNDREDSTRING),t={color:j.lineColor,alpha:j.lineAlpha};j.plotCosmetics={fillStyle:getFillColor(q,r*s/100),strokeStyle:getFillColor(o,r),borderWidth:p,lineWidth:j.lineThickness,lineStrokeStyle:toRaphaelColor(t)},i.config.JSONData=a,j.anchorBorderThickness=pluckNumber(a.anchorborderthickness,m.anchorborderthickness,n?1:0),j.chunkSize=Math.floor(Math.min((a.data||[]).length/5,5e4)),h=j.staticRadius=pluckNumber(m.staticradius,0),j.radius=pluckNumber(a.radius,a.anchorradius,m.radius,m.anchorradius,h?3:.5),g=j.showHoverEffect,b=getFirstColor(pluck(a.plotfillhovercolor,a.hovercolor,m.plotfillhovercolor,m.hovercolor,j.anchorbgcolor)),c=pluck(a.plotfillhoveralpha,a.hoveralpha,m.plotfillhoveralpha,m.hoveralpha,HUNDREDSTRING),d=getFirstColor(pluck(a.plotfillhovercolor,a.hovercolor,m.plotfillhovercolor,m.hovercolor,b)),f=pluck(a.plotfillhoveralpha,a.hoveralpha,m.plotfillhoveralpha,m.hoveralpha,HUNDREDSTRING),e=pluckNumber(a.borderhoverthickness,m.borderhoverthickness,1),j.hoverCosmetics={showHoverEffect:g,fill:getFillColor(b,c),borderColor:getFillColor(d,f),borderThickness:e},j.tooltip={toolTipVisible:l.showtooltip,seriesNameInToolTip:l.seriesnameintooltip,toolTipSepChar:l.tooltipsepchar},j.lastViewPort={},this.disableScrollBars(),this.setState('dirty',!0)}hasDrawingRefChanged(){var a=this,b=a.getFromEnv('xAxis'),c=a.getFromEnv('yAxis'),d=a.config,e=d.axisConfig=d.axisConfig||{},f=!1,g=getVisibilityRatio(b),h=a.getFromEnv('chartConfig'),i=getVisibilityRatio(c);return f=e.xZoomScale!==g||e.yZoomScale!==i||d.prevCanvasHeight!==h.canvasHeight||d.prevCanvasWidth!==h.canvasWidth,e.xZoomScale=g,e.yZoomScale=i,d.prevCanvasHeight=h.canvasHeight,d.prevCanvasWidth=h.canvasWidth,f}saveScrollPos(){var a=this,b=a.getFromEnv('xAxis'),c=a.getFromEnv('yAxis'),d=a.config,e=d.axisConfig=d.axisConfig||{};e.xScrollPos=b.config.apparentScrollPos,e.yScrollPos=c.config.apparentScrollPos}disableScrollBars(){var a=this,b=a.getFromEnv('xAxis'),c=a.getFromEnv('yAxis');b.setScrollType('none'),c.setScrollType('none')}calculateZoomedRadius(){var a=Math.min,b=this,c=b.config,d=b.getFromEnv('chart').config,e=c.axisConfig;c.zoomedRadius=a(c.staticRadius?c.radius:c.radius*a(e.xZoomScale,e.yZoomScale),d.canvasWidth/2,d.canvasHeight/2)}setupKdTree(){var a,b,c,d=this,e=d.components.data,f=e.length,g=[];for(b=0;b<f;++b)(a=e[b],c=a.config.setValue,!(isNaN(c.x)||isNaN(c.y)))&&(c.index=b,g.push({x:c.x,y:c.y,index:b,data:a,r:1}));d.addJob('kdtree',function(){d.dataTree=new KdTree().buildKdTree(g)},priorityList.kdTree)}_getHoveredPlot(a,b){var c,d,e,f=this,g=f.getFromEnv('xAxis'),h=f.getFromEnv('yAxis');if(d=g.getValue(a+g.getTranslation()),e=h.getValue(b+h.getTranslation()),c=f.dataTree&&f.dataTree.getNeighbour({x:d,y:e,options:f.zoomRadiusOb},!0),c)return c.data.x=c.x,c.data.y=c.y,{pointIndex:c.index||c.i,hovered:!0,pointObj:c.data}}_decideTooltipType(a,b){var c=this,d=c.getFromEnv('toolTipController'),e=c.config.currentToolTip,f=c.components,g=f.data,h=g[a],i=h&&(h.config.finalTooltext||h.config.toolText),j=b.originalEvent;i&&(e?d.draw(j,i,e):e=c.config.currentToolTip=d.draw(j,i))}_firePlotEvent(a,b,c){var d,e,f=this,g=f.getFromEnv('chart'),h=f.components,i=f.getFromEnv('toolTipController'),j=h.data,k=j[b],l=f.getFromEnv('paper').canvas.style;k&&(d=k.config,e=d.setLink,'mouseover'===a?(f._decideTooltipType(b,c),f.highlightPoint(f.config.showHoverEffect,k),g.plotEventHandler(f.getGraphicalElement('tracker'),c,'dataplotRollover'),e&&(l.cursor='pointer')):'mouseout'===a?(i.hide(f.config.currentToolTip),e&&(l.cursor=DEFAULT_CURSOR),f.highlightPoint(!1),g.plotEventHandler(f.getGraphicalElement('tracker'),c,'dataplotRollout')):'click'===a?g.plotEventHandler(f.getGraphicalElement('tracker'),c,'dataplotClick'):'mousemove'===a?f._decideTooltipType(b,c):void 0)}highlightPoint(a,b){var c,d=this,e=d.getFromEnv('chart'),f=e.config,g=d.getFromEnv('animationManager'),h=d.getGraphicalElement('tracker'),i=d.getFromEnv('xAxis'),j=d.getFromEnv('yAxis'),k=d&&d.config,l=k&&k.zoomedRadius||0,m=k&&k.hoverCosmetics,n=m&&m.fill,o=m&&m.borderColor,p=m&&m.borderThickness,q={},r=b&&b.link;a&&(q={r:l,fill:n,stroke:o,"stroke-width":p,cx:i.getPixel(b.x),cy:j.getPixel(b.y)}),g.setAnimationState(a?'mouseover':'mouseout'),c=g.setAnimation({el:h||'circle',attr:a&&q,container:d.getContainer('plotGroup'),component:d,doNotRemove:!0,callback:!a&&hideFn}),a&&c.show(),h||d.addGraphicalElement('tracker',c),b&&c.data('eventArgs',{x:b.x,y:b.y,tooltip:b.config.toolText,link:r}),f.lastHoveredPoint=b,q.cursor=r?POINTER:''}drawCommonElements(){}animateCommonElements(){}remove(){super.remove(),this._deleteGridImages()}drawPlots(){var a,b,c,d,e,f=this,g=f.getFromEnv('animationManager'),h=f.getFromEnv('xAxis'),i=f.getFromEnv('yAxis'),j=f.config,k=f.getContainer('plotGroup'),l=f.getContainer('containerLine'),m=f.getContainer('containerPlot'),n=!1,o=f.config.anchorBorderThickness;f.saveScrollPos(),d=g.setAnimation({el:l||'group',attr:{name:'lineGroup'},container:k,component:f,label:'group'}),e=g.setAnimation({el:m||'group',attr:{name:'plotGroup'},container:k,component:f,label:'group'}),f.getState('visible')?(d.show(),e.show()):(d.hide(),e.hide()),l||f.addContainer('containerLine',d),m||f.addContainer('containerPlot',e),(f.hasDrawingRefChanged()||f.wasLastDrawPixelated||f.getState('dirty'))&&(f.wasLastDrawPixelated=!1,f.calculateZoomedRadius(),a=getVisibilityRatio(h),b=getVisibilityRatio(i),c=j.radius*Math.min(a,b),f.zoomRadiusOb={rx:h.getValue(c+o)-h.getValue(0),ry:i.getValue(0)-i.getValue(c+o)},f._deleteGridImages(),f._graphics._grid={},n=!0),f._gridDraw(n),f.setState('dirty',!1)}_deleteGridImages(){var a,b,c,d,e,f,g,h,i=this,j=i.config,k=i._graphics,l=k._imagePool||(k._imagePool=[]),m=k._canvasPool||(k._canvasPool=[]),n=k._lineImagePool||(k._lineImagePool=[]),o=k._lineCanvasPool||(k._lineCanvasPool=[]),p=k._grid||[],q=j._batchDrawTimers;if(q&&q.length)for(;q.length;)clearTimeout(q.shift());for(f in p)if(h=p[f],h)for(g in h)e=h[g],e&&e.drawState&&(a=e.image,a.attr({src:'',width:0,height:0}),l.push(a),delete e.image,d=e.canvas,m.push(d),delete e.canvas,delete e.ctx,(b=e.lineImage)&&(b.attr({src:'',width:0,height:0}),n.push(b),delete e.lineImage,c=e.lineCanvas,o.push(c),delete e.lineCanvas,delete e.lineCtx));delete k._grid}_gridDraw(a){var b=this,c=b.config;clearTimeout(c.timer),a?b._gridManager():c.timer=setTimeout(function(){b._gridManager()},10)}getAllGrids(){var a,b,c,d,e,f,g,h,k,l=Math.max,m=Math.ceil,n=Math.min,o=Math.abs,p=this,q=p.config,r=p.getFromEnv('chart').config,s=p.getFromEnv('xAxis'),t=p.getFromEnv('yAxis'),u=getVisibleGridsIndex(s),v=getVisibleGridsIndex(t),w=numberNeighbours(u.focusedGrid),x=numberNeighbours(v.focusedGrid),y=[],z=[],A=0,B=0,C=p._graphics,D=C._grid,E={},F=getVisibilityRatio(s),G=getVisibilityRatio(t),H=m(G),I=m(F),J=l(v.focusedGrid-1,0),K=n(v.focusedGrid+1,H-1),L=l(u.focusedGrid-1,0),M=n(u.focusedGrid+1,I-1),N=s.getAxisConfig('axisDimention').axisLength||r.canvasWidth,O=t.getAxisConfig('axisDimention').axisLength||r.canvasHeight,P=s.config,Q=t.config,R=P.axisRange.min,S=P.axisRange.max,T=Q.axisRange.min,U=Q.axisRange.max,V=q.radius*n(F,G),W=q.plotCosmetics.borderWidth,X=V+W,Y=o(X/(N*F/(s.config.axisRange.max-s.config.axisRange.min))),Z=o(X/(O*G/(t.config.axisRange.max-t.config.axisRange.min))),$=t.getPixel(t.config.axisRange.max),_=s.getPixel(s.config.axisRange.min);for(D||(p.config.grids=D={}),A=J;A<=K;++A)for(D[A]=E=D[A]||{},h=$+A*O,d=t.getValue(h),e=t.getValue(h+O),B=L;B<=M;++B)f=0===B?X:0,g=B===I-1?X:0,k=_+B*N-f,c=s.getValue(k),b=s.getValue(k+N+f+g),E[B]=a=E[B]||{xPixel:k,width:o(s.getPixel(b)-k),yPixel:h,height:t.getPixel(e)-h,xLeftValue:c,yTopValue:d,xRightValue:b,yBottomValue:e,drawState:0,xMinWPad:l(n(c,b)-Y,R),yMinWPad:l(n(d,e)-Z,T),xMaxWPad:n(l(c,b)+Y,S),yMaxWPad:n(l(d,e)+Z,U),i:A,j:B},a.drawState||(~u.indexOf(B)&&~v.indexOf(A)?y.push(a):~w.indexOf(B)&&~x.indexOf(A)&&z.push(a));return{focused:y,nearBy:z}}allocatePosition(){var a,b,c,d,e,f=this,g=f.config,h=f.components.data,j=h.length,k=f.getFromEnv('xAxis'),l=f.getFromEnv('yAxis'),m=g.zoomedRadius;for(c=0;c<j;c++)e=h[c].config,d=e.setValue,a=k.getPixel(d.x),b=l.getPixel(d.y),e.props={element:{attr:{polypath:[0,a,b,m||e.anchorProps.radius]}},label:{attr:{}}}}_gridManager(){var a,b=this,c={};c=b.getAllGrids(),b.config._drawGrid=c.focused,(c.focused.length||c.nearBy.length)&&(b.config._drawGrid=c.focused,a=function(){b.config._drawGrid=c.nearBy,b._drawGridArr()},b._drawGridArr(a))}_drawGridArr(a){var b,c,d,e,f,g,h,i,j,k=this,l=k.config,m=l.drawLine,n=l._drawGrid,o=[],p=k.getFromEnv('animationManager'),q=k.getContainer('containerLine'),r=k.getContainer('containerPlot'),s=k.getFromEnv('xAxis'),t=k.getFromEnv('yAxis'),u=getVisibilityRatio(s),v=getVisibilityRatio(t),w=k._graphics._imagePool||[],x=k._graphics._canvasPool||[],y=k._graphics._lineImagePool||[],z=k._graphics._lineCanvasPool||[],A=l.plotCosmetics,B=l.radius*Math.min(u,v);if(n.length){for(;n.length;)(b=n.shift(),i=b.xPixel,j=b.yPixel,g=b.width,h=b.height,2!==b.drawState)&&(b.drawState=2,m&&(y.length&&(b.lineImage=y.shift()),b.lineImage=p.setAnimation({el:b.lineImage||'image',attr:{x:i,y:j,width:g,height:h},container:q,component:k,label:'image'}),b.lineCanvas=z.length?d=z.shift():d=win.document.createElement('canvas'),d.setAttribute('width',g),d.setAttribute('height',h),f=b.lineCtx=d.getContext('2d'),f.fillStyle=A.fillStyle,f.strokeStyle=A.lineStrokeStyle,f.lineWidth=A.lineWidth),w.length&&(b.image=w.shift()),b.image=p.setAnimation({el:b.image||'image',attr:{x:i,y:j,width:g,height:h},container:r,component:k,label:'image'}),b.canvas=x.length?c=x.shift():c=win.document.createElement('canvas'),c.setAttribute('width',g),c.setAttribute('height',h),e=b.ctx=c.getContext('2d'),1>B?(e.strokeStyle=A.fillStyle,e.lineWidth=.5):(e.fillStyle=A.fillStyle,e.strokeStyle=A.strokeStyle,e.lineWidth=A.borderWidth),o.push(b));l._batchDrawindex=k.config.JSONData.data&&k.config.JSONData.data.length-1||0,k._drawGridArrBatch(o,a,!l.animation.enabled)}else a&&a()}_drawGridArrBatch(a,b,c){var d,e,f,g,h,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D=Math.round,E=this,F=E.config,G=F.drawLine,H=F.plotCosmetics,I=F._batchDrawindex,J=E.components.data,K=F.chunkSize,L=I-K,M=E.getFromEnv('xAxis'),N=E.getFromEnv('yAxis'),O=E.getFromEnv('chart'),P=E.getFromEnv('animationManager'),Q=O.getFromEnv('dataSource'),R=F.JSONData,S=F.zoomedRadius,T=pluckNumber(R.showregressionline,O.config.showregressionline,0),U=F._store||[],V=H.lineWidth||1>S;for(T&&(y=toRaphaelColor(pluck(R.regressionlinecolor,Q.chart.regressionlinecolor,F.anchorbordercolor,F.lineColor,'fff000')),z=pluckNumber(R.regressionlinethickness,Q.chart.regressionlinethickness,1),A=pluckNumber(R.regressionlinealpha,Q.chart.regressionlinealpha,100)/100),m=0;m<a.length;m+=1)a[m].ctx.beginPath(),G&&a[m].lineCtx.beginPath();for(L=0>=L?0:L;I>=L;I-=1)if(q=J[I]&&J[I].config.setValue,!(!q||isNaN(q.x)||isNaN(q.y)))for(m=0;m<a.length;m+=1){if(n=a[m],!inRangeMod(q.x,n.xMinWPad,n.xMaxWPad)||!inRangeMod(q.y,n.yMinWPad,n.yMaxWPad)){G&&I&&lineIntersectsGrid(q,J[I-1].config.setValue,n)&&(r=J[I-1].config.setValue,B=M.getPixel(r.x)-n.xPixel,C=N.getPixel(r.y)-n.yPixel,d=M.getPixel(q.x)-n.xPixel,e=N.getPixel(q.y)-n.yPixel,p=n.lineCtx,p.moveTo(D(B),D(C)),p.lineTo(d,e));continue}o=n.ctx,p=n.lineCtx,d=M.getPixel(q.x)-n.xPixel,e=N.getPixel(q.y)-n.yPixel,l=U[d],l||(l=U[d]={}),l[e]||(l[e]=!0,G&&(r=I&&J[I-1].config.setValue,s=I<J.length-1&&J[I+1].config.setValue,r&&!isNaN(r.x)&&!isNaN(r.y)&&(B=M.getPixel(r.x)-n.xPixel,C=N.getPixel(r.y)-n.yPixel,p.moveTo(D(B),D(C)),p.lineTo(d,e),(!inRangeMod(s.x,n.xMinWPad,n.xMaxWPad)||!inRangeMod(s.y,n.yMinWPad,n.yMaxWPad))&&!isNaN(s.x)&&!isNaN(s.y)&&p.lineTo(M.getPixel(s.x)-n.xPixel,N.getPixel(s.y)-n.yPixel))),1>S?(o.moveTo(d,e),o.lineTo(d+1,e)):(o.moveTo(d+S,e),o.arc(d,e,S,0,pi2)))}for(m=0;m<a.length;m+=1)n=a[m],o=n.ctx,o.fill(),V&&o.stroke(),o.closePath(),G&&(p=n.lineCtx,V&&p.stroke(),p.closePath());if(F._batchDrawindex=I,0<=I){if(!c)for(m=0;m<a.length;m+=1)v=a[m].image,w=a[m].canvas,P.setAnimation({el:v,attr:{src:w.toDataURL('image/png')},component:E}),F.drawLine&&(t=a[m].lineImage,u=a[m].lineCanvas,P.setAnimation({el:t,src:w.toDataURL('image/png'),component:E}));(F._batchDrawTimers||(F._batchDrawTimers=[])).push(setTimeout(function(){E.getFromEnv('chart')&&E._drawGridArrBatch(a,b,c)},0))}else{if(E.setupKdTree(),delete F._store,T)for(x=F.regressionPoints,m=0;m<a.length;m+=1)(n=a[m],v=n.image,w=n.canvas,o=n.ctx,!!x.length)&&(f=M.getPixel(x[0].x)-n.xPixel,h=N.getPixel(x[0].y)-n.yPixel,g=M.getPixel(x[1].x)-n.xPixel,k=N.getPixel(x[1].y)-n.yPixel,o.beginPath(),o.strokeStyle=y,o.lineWidth=z,o.globalAlpha=A,o.moveTo(f,h),o.lineTo(g,k),o.stroke(),o.closePath());for(m=0;m<a.length;m+=1)n=a[m],v=n.image,w=n.canvas,n.drawState=1,P.setAnimation({el:v,attr:{src:w.toDataURL('image/png')},component:E}),G&&(t=n.lineImage,u=n.lineCanvas,P.setAnimation({el:t,attr:{src:u.toDataURL('image/png')},component:E}));b&&b()}}getRegressionPoints(){var a,b,c=Math.max,d=Math.min,e=this,f=e.config.regressionPoints,g=-Infinity,h=1/0,j=-Infinity,k=1/0;if(f&&f.length){for(b=f.length,a=0;a<b;a++)g=c(g,f[a].x),h=d(h,f[a].x),j=c(j,f[a].y),k=d(k,f[a].y);return{max:j,min:k,xMax:g,xMin:h}}}show(){var a=this,b=a.getContainer('containerLine'),c=a.getContainer('containerPlot'),d=a.getFromEnv('legend');d&&d.getItem(a.config.legendItemId)&&d.getItem(a.config.legendItemId).removeLegendState('hidden'),a.setState('visible',!0),b.show(),c.show(),a.setState('dirty',!0)}setContainerVisibility(){}draw(){var a,b,c=this,d=c.config,e=c.getFromEnv('xAxis'),f=e.getPixel(0),g=e.getPixel(1),h=c.getFromEnv('groupMaxWidth'),i=d.drawn,j=c.getSkippingInfo&&c.getSkippingInfo()||{},k=j.skippingApplied;h||(h=Math.abs(g-f),c.addToEnv('groupMaxWidth',h)),i||c.createContainer(),c.setContainerVisibility(!0),k&&c.hidePlots(),c.drawPlots(),c.drawCommonElements&&!c.config.skipCommonElements&&c.drawCommonElements(),d.drawn?c.drawLabel(a,b):c.addJob('labelDrawID',function(){c.drawLabel(a,b)},priorityList.label),d.drawn=!0,c.removePlots()}hide(){var a=this,b=a.getContainer('containerLine'),c=a.getContainer('containerPlot'),d=a.getFromEnv('legend');d&&d.getItem(a.config.legendItemId)&&d.getItem(a.config.legendItemId).setLegendState('hidden'),b.hide(),c.hide(),a.setState('dirty',!0),a.setState('visible',!1)}_addLegend(){var a,b,c=this,d=c.getFromEnv('chart'),e=d.getFromEnv('dataSource').chart,f=d.getFromEnv('legend'),g=c.config,h=c.config.JSONData,i=pluck(h.anchorbordercolor,e.anchorbordercolor),j=getFirstColor(pluck(i,g.plotBorderColor)),k=getFirstColor(pluck(h.anchorbgcolor,h.color,e.anchorbgcolor,g.plotColor)),l=pluck(h.anchoralpha,h.alpha,e.anchoralpha,HUNDREDSTRING),m=pluck(h.anchorbgalpha,h.alpha,e.anchorbgalpha,HUNDREDSTRING),n=getFillColor(k,l*m/100),o=getFillColor(j,l);b={enabled:g.includeInLegend,type:c.type,anchorSide:2,label:getFirstValue(c.config.JSONData.seriesname)},g.includeinlegend?(a=f.getItem(c.config.legendItemId),a?a.configure({style:f.config.itemStyle,hiddenStyle:f.config.itemHiddenStyle,datasetVisible:f.config.datasetVisible,hoverStyle:f.config.itemHoverStyle}):(c.config.legendItemId=f.createItem(c),a=f.getItem(c.config.legendItemId),c.addExtEventListener('click',function(){a.itemClickFn()},a)),a.configure(b),a.setStateCosmetics('default',{symbol:{fill:n,stroke:o,rawFillColor:k,rawStrokeColor:g.anchorbordercolor,"stroke-width":g.anchorBorderThickness}}),c.getState('visible')?a.removeLegendState('hidden'):a.setLegendState('hidden')):c.config.legendItemId&&f.disposeItem(c.config.legendItemId)}_setConfigure(){var a,b,c,d,e,f,g,h,j,k,l,m,n=-Infinity,o=+Infinity,p=n,q=o,r=o,s=n,t=this,u=t.components.data||(t.components.data=[]),v=t.getFromEnv('chart'),w=t.config,x=t.config.JSONData,y=v.getFromEnv('dataSource').chart,z=x.data||[],A=z.length,B=t.getFromEnv('number-formatter'),C=parseUnsafeString(y.yaxisname),D=parseUnsafeString(y.xaxisname),E=w.lineDashed,F=w.lineDashStyle,G=pluckNumber(x.showregressionline,v.config.showregressionline,0),H=pluckNumber(x.showyonx,y.showyonx,1),I=w.parentYAxis,J=w.toolTipSepChar,K=w.seriesname;for(a=0;a<A;a+=1)d=z[a],c=u[a]||(u[a]={}),b=c.config||(c.config={}),b.setValue=e={x:B.getCleanValue(d.x),y:B.getCleanValue(d.y),index:a},s<e.x&&(s=e.x,w.rightMostData=c),r>e.x&&(r=e.x,w.leftMostData=c),p=Math.max(p,e.y),q=Math.min(q,e.y),w.showRegressionLine&&this.pointValueWatcher(e.x,e.y,w.regressionObj),b.setLink=pluck(d.link),b.anchorProps=this._parseAnchorProperties(a),b.showValue=pluckNumber(d.showvalue,w.showValues),b.dashed=pluckNumber(d.dashed,E),b.color=pluck(d.color,w.lineColor),b.alpha=pluck(d.alpha,w.lineAlpha),b.dashStyle=b.dashed?F:'none',b.toolTipValue=g=B.dataLabels(e.y,I),b.setDisplayValue=m=parseUnsafeString(d.displayvalue),k=b.formatedVal=pluck(d.toolTipValue,B.dataLabels(e.y,I)),l=B.xAxis(e.x),b.displayValue=pluck(m,g),b.setTooltext=getValidValue(parseUnsafeString(pluck(d.tooltext,w.plotToolText))),w.showTooltip?b.setTooltext===UNDEF?null===k?f=!1:(f=K?K+J:BLANKSTRING,f+=e.x?l+J:BLANKSTRING,f+=g):(h=[4,5,6,7,8,9,10,11],j={yaxisName:C,xaxisName:D,yDataValue:k,xDataValue:l},f=parseTooltext(b.setTooltext,h,j,d,y,x)):f=!1,b.toolText=f,c?!c.graphics&&(u[a].graphics={}):c=u[a]={graphics:{}},b.hoverEffects=this._parseHoverEffectOptions(c),b.anchorProps.isAnchorHoverRadius=b.hoverEffects.anchorRadius;w.xMax=s,w.xMin=r,w.yMin=q,w.yMax=p,w.regressionPoints=G?getLinearRegressionPoints(x.data.slice(),H)[1]:[],t.ErrorValueConfigure&&t.ErrorValueConfigure()}}export default ZoomScatter;