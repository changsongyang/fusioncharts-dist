import Brush from'../components/brush';export default(a=>{let b;b=a.attachChild(Brush,'brush'),b.configure({values:a.config.values,style:a.config.style.brush||{}})});