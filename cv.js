const DOMstrings = {
    main: document.querySelector('.home'),
    school: document.querySelector('.school'),
    expiriance: document.querySelector('.skills'),
    contact_canvas: document.querySelector('.contact'),
    contact: document.querySelector('#contact_me'),
    picture: document.querySelector('.cv_picture-crop'),
    about: document.querySelector('.about_me'),
    border: document.querySelector('.main_top'),
    lArrow: document.querySelector('.l'),
    rArrow: document.querySelector('.r')
}
let focus = 0;
const sections = document.querySelectorAll('section');

const getFocus = () => {
    sections.forEach( (section, index) => {
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
            setMarker(section.id)
        } else if(index < focus) {
            section.classList.add('left')
            if( section.classList.contains('focuse')) {
                section.classList.remove('focuse')
            }
            if( section.classList.contains('right')) {
                section.classList.remove('remove')
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
let nav = document.querySelectorAll('.navigation')

nav.forEach( link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const id = link.href.slice(link.href.indexOf('#') + 1);
        //chenge focus
        sections.forEach( (section, index) => {
            if( section.id === id ) {
                focus = index;
            }
        })
        //setMarker on the cliked one
        setMarker(id)
        //removeMarket on every other
        getFocus()
    })
})

const setMarker = id => {
    nav.forEach( (link, index) => {
        if( link.href.includes(id) ) {
            if ( index === 0 ) {
                if( !DOMstrings.lArrow.classList.contains('unvisible') )
                    DOMstrings.lArrow.classList.add('unvisible')
            } else {
                if(DOMstrings.lArrow.classList.contains('unvisible'))
                    DOMstrings.lArrow.classList.remove('unvisible')
            }
            if ( index === nav.length -1 ) {
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

getFocus()

document.querySelectorAll('.arrow').forEach( arrow => {
    arrow.addEventListener('click', () => {
        if( arrow.classList.contains('r')) {
            if(focus < sections.length - 1) focus++; 
        } else {
            if( focus > 0) focus--;
        }
        getFocus();
    })
})

const colors = {
    dots: '#aaa',
    shots: '#fff'
}

let cursor = {
    x: 0,
    y: 0
}

function  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
    scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

    return {
        x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        y: (evt.clientY - rect.top) * scaleY    // been adjusted to be relative to element 
    }
}

window.addEventListener('mousemove', e => {
    cursor = getMousePos(DOMstrings.main, e)    // canvas is a backround Z-index lower then window 
})
const ifResize = (can, func) => {
   window.addEventListener('resize', () => {
    can.width =  window.innerWidth;
    can.height = window.innerHeight;
    if (func) {
        func()
    }
}) 
}


const getDistans = ( x1, y1, x2, y2 ) => Math.sqrt( Math.pow((x2 - x1) , 2) + Math.pow((y2 - y1) , 2) )

let dot = (x, y, r, con) => {
    let drowDot = () => {
        con.beginPath();
        con.arc(x, y, r, 0, 2 * Math.PI, true);
        con.fill();
    }
    let sizeUpR = () => {
        if( r < 3 ){
            r += 0.1;
        }
    }
    let sizeDownR = () => {
        if( r > 1 ){
            r -= 0.1;
        }
    }
    return {
        drowDot,
        sizeDownR,
        sizeUpR,
        getX: () => x,
        getY: () => y,
        moveX: dx => { x += dx },
        moveY: dy => { y += dy },
        getSize: () => r
    }
}

DOMstrings.picture.addEventListener('click', () => {
    DOMstrings.picture.classList.add('cv_picture-out')
    DOMstrings.about.classList.add('about_me-in')
    DOMstrings.border.classList.add('main_top-noborderos')
})
DOMstrings.about.addEventListener('click', () => {
    DOMstrings.picture.classList.remove('cv_picture-out')
    DOMstrings.about.classList.remove('about_me-in')
    DOMstrings.border.classList.remove('main_top-noborderos')

})

const followMe = can => {
    const context = can.getContext('2d');
    can.width =  window.innerWidth;
    can.height = window.innerHeight;
    let dots = [];
    window.addEventListener('mousemove', e => {
        cursor = getMousePos(can, e)    // canvas is a backround Z-index lower then window 
    })
    const initBoard = () => {
        dots = [];
        for( let i = 10; i < can.width; i += 10){
            for( let j = 10; j < can.height; j += 10) {
                dots.push( dot(i, j, 1, context) );
            }
        }
    }
  
    let animate = () => {
        requestAnimationFrame(animate);
        context.clearRect(0, 0, can.width, can.height);
        context.fillStyle = colors.dots;
        dots.forEach(dot => {
            if(getDistans(dot.getX(), dot.getY(), cursor.x, cursor.y%window.innerHeight) < (60) ) {
                dot.sizeUpR()
            } else {
                dot.sizeDownR()
            }
            dot.drowDot()
        })
    }
    initBoard()
    ifResize( can, initBoard)
    animate()
}

const rainOnMe = can => {
    const context = can.getContext('2d');
    can.width = window.innerWidth;
    can.height = window.innerHeight;

    window.addEventListener('mousemove', e => {
        cursor = getMousePos(can, e)    // canvas is a backround Z-index lower then window 
    })
    let drops = [];
    let colisions = 0;

    let animate = () => {
        context.fillStyle = colors.dots;
        requestAnimationFrame(animate);
        context.clearRect(0, 0, innerWidth, innerHeight);
        for( let rain = 0; rain < 1 ; rain++ ){
            drops.push(dot( Math.random() * can.width , 0 , 2, context))
        }
        drops.forEach( (drop, indx) => {
            drop.moveY(1);
            drop.drowDot();
            if(drop.getY() > can.height){
                drops.splice(indx, 1);
            }
            if(getDistans(drop.getX(), drop.getY(), cursor.x, cursor.y%window.innerHeight) < 5) {
                colisions++;
                drops.splice(indx, 1);
            }
        })

        context.beginPath();
        context.strokeStyle = colors.dots;
        
        context.arc(cursor.x, cursor.y%window.innerHeight, 5, 0, Math.PI * 1);
        context.stroke();
        
        context.font='20px sans-serif';
        context.fillText(colisions, 20, 20);
        context.font='10px sans-serif';
        context.fillText('Hvor mange dråper kan du fange med markøren?', 20, 30);
    }
    ifResize(can)
    animate()
}

const aim10 = can => {
    const context = can.getContext('2d');
    can.width = window.innerWidth;
    can.height = window.innerHeight;
    ifResize(can)
    window.addEventListener('mousemove', e => {
        cursor = getMousePos(can, e)    // canvas is a backround Z-index lower then window 
    })
    const target = ( x, y, numRings) => {
        for( let n = 0; n < numRings; n++ ){
            context.beginPath();
            context.arc(x, y, n * 10 + 10, 0, Math.PI * 2);
            context.stroke();
        }
    }
    const viewer = (x, y) => {
        context.beginPath();
        context.arc(x, y, 10, 0, Math.PI * 2);
        context.stroke();

        context.beginPath();
        context.moveTo(x - 15, y);
        context.lineTo(x + 15, y);
        context.stroke();
        
        context.beginPath();
        context.moveTo(x, y - 15);
        context.lineTo(x, y + 15);
        context.stroke();

    }
    let confused = {
        x: cursor.x  ,
        y: cursor.y%window.innerHeight
    }
    let shots = []
    let ranDirection = () => {
        confused.x = ( Math.random() * 40 - 20) + cursor.x;
        confused.y = ( Math.random() * 40 - 20) + cursor.y%window.innerHeight;
    }
    DOMstrings.contact.addEventListener('click', (e) => { // catching click on leyer over canvas
        shots.push(dot(confused.x, confused.y, 5, context))
        console.log('pang')
    })

    const animate = () => {
        context.strokeStyle = colors.dots;
        context.fillStyle = colors.shots;
        requestAnimationFrame(animate);
        context.clearRect(0, 0, innerWidth, innerHeight);
        target(50, 100, 4)
        ranDirection()
        viewer(confused.x, confused.y)
        shots.forEach( shot => {
                shot.drowDot()
        })
    }
    animate()
}

const blobs = can => {
    const context = can.getContext('2d');
    can.width = window.innerWidth;
    can.height = window.innerHeight;
    window.addEventListener('mousemove', e => {
        cursor = getMousePos(can, e)    // canvas is a backround Z-index lower then window 
    })
    const bloppers = [];
    const make = () => {
        const ranX = Math.random()*can.width;
        const ranY = Math.random()*can.height;
        bloppers.push(dot(ranX, ranY, 1, context))
        bloppers[bloppers.length - 1].drowDot()
    }

    const animate = () => {    
        context.fillStyle= colors.dots;
        requestAnimationFrame(animate);
        context.clearRect(0, 0, innerWidth, innerHeight);
        for( let b = 0; b < 50; b++) {
            make()
        }    
        bloppers.forEach( ( dot, index) => {
            if( dot.getSize() > 3 ) {
                bloppers.splice( index, 1 )
            }
            dot.drowDot()
            dot.sizeUpR()
            if( getDistans(cursor.x, cursor.y%window.innerHeight, dot.getX(), dot.getY() ) < 40 ){
                dot.moveX((cursor.x - dot.getY() )/50)
                dot.moveY((cursor.y%window.innerHeight - dot.getY() )/50)
            }
        })
    }
    ifResize(can)
    animate()
}

rainOnMe(DOMstrings.school)
followMe(DOMstrings.main)
aim10(DOMstrings.contact_canvas)
blobs(DOMstrings.expiriance)

