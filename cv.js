import {ballAnim, followMe, fff, ifResize, heart, wave, getMousePos} from './animations.js'

const DOMstrings = {
    sections: document.querySelectorAll('section'),
    nav: document.querySelectorAll('.navigation'),
    arrows: document.querySelectorAll('.arrow'),
    background: document.querySelector('.background'),    
    lArrow: document.querySelector('.l'),
    rArrow: document.querySelector('.r')
}
export let cursor = {
    x: 0,
    y: 0
}
const animations = [ ballAnim, fff, heart, wave, followMe]
let curent = 0;
let curAnim = animations[curent](DOMstrings.background)
window.addEventListener('mousemove', e => {
    cursor = getMousePos(DOMstrings.background, e)    // canvas is a backround Z-index lower then window 
})
const changeBackground = () => {
    curent++;
    if(curent > animations.length - 1) curent = 0;
    curAnim.cancel_animation()
    curAnim = animations[curent](DOMstrings.background)
    curAnim.initBoard()
    curAnim.animate(0)
    ifResize(DOMstrings.background, curAnim.initBoard)
}
let focus = 0;
const setFocus = () => {
    DOMstrings.sections.forEach( (section, index) => {
        if(index === focus) {
            if( !section.classList.contains('focuse')) {
                section.classList.add('focuse')
            }
            if( section.classList.contains('left')) {
                section.classList.remove('left')
            }
            if( section.classList.contains('right')) {
                section.classList.remove('right')
            }
            // animations[index](DOMstrings.background)
            setMarker(section.id)
        } else if(index < focus) {
            section.classList.add('left')
            if( section.classList.contains('focuse')) {
                section.classList.remove('focuse')
            }
            if( section.classList.contains('right')) {
                section.classList.remove('right')
            }
        } else if(index > focus) {
            section.classList.add('right')
            if( section.classList.contains('focuse')) {
                section.classList.remove('focuse')
            }
            if( section.classList.contains('left')) {
                section.classList.remove('left')
            }
        }
    })
}

DOMstrings.nav.forEach( link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const id = link.href.slice(link.href.indexOf('#') + 1);
        //chenge focus
        DOMstrings.sections.forEach( (section, index) => {
            if( section.id === id ) {
                focus = index;
            }
        })
        //setMarker on the cliked one
        setMarker(id);
        //removeMarket on every other
        setFocus();
        changeBackground();

    })
})

const setMarker = id => {
    DOMstrings.nav.forEach( (link, index) => {
        if( link.href.includes(id) ) {
            if ( index === 0 ) {
                if( !DOMstrings.lArrow.classList.contains('unvisible') )
                    DOMstrings.lArrow.classList.add('unvisible')
            } else {
                if(DOMstrings.lArrow.classList.contains('unvisible'))
                    DOMstrings.lArrow.classList.remove('unvisible')
            }
            if ( index === DOMstrings.nav.length -1 ) {
                if( !DOMstrings.rArrow.classList.contains('unvisible') )
                    DOMstrings.rArrow.classList.add('unvisible')
            } else {
                if(DOMstrings.rArrow.classList.contains('unvisible'))
                    DOMstrings.rArrow.classList.remove('unvisible')
            }
            if( !link.classList.contains('marker') ) {
                link.classList.add('marker')
            }
        } else {
            if( link.classList.contains('marker') ) {
                link.classList.remove('marker')
            }
        }
    })
}

setFocus();
changeBackground();

DOMstrings.arrows.forEach( arrow => {
    arrow.addEventListener('click', () => {
        if( arrow.classList.contains('r')) {
            if(focus < DOMstrings.sections.length - 1) focus++; 
        } else {
            if( focus > 0) focus--;
        }
        setFocus();
        changeBackground();

    })
})
const navigate = e => {
    if(e.keyCode === 37){
        if( focus > 0) focus--;
    } else if(e.keyCode === 39){
        if(focus < DOMstrings.sections.length - 1) focus++; 
    }
    setFocus();
    changeBackground();

}

document.onkeydown = navigate

document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        
        if ( xDiff > 0 ) {
            
            /* left swipe */ if(focus < DOMstrings.sections.length - 1) focus++; 
            
        } else {
            /* right swipe */ if( focus > 0) focus--;
            
        }                       
    }
    setFocus();

    /* reset values */
    xDown = null;
    yDown = null;                                             
};



curAnim.initBoard()
curAnim.animate(0)

ifResize(DOMstrings.background, curAnim.initBoard)


