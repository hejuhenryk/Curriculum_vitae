import {cursor} from './cv.js'

const colors = {
    dots: '#edc7b7',
    shots: '#fff'
}

const compresion = 2.5;

export const getMousePos = (canvas, evt) => {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
    scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
    return {
        x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        y: (evt.clientY - rect.top) * scaleY    // been adjusted to be relative to element 
    }
}

export const ifResize = (can, func) => {
    window.addEventListener('resize', () => {
        can.width =  window.innerWidth/compresion;
        can.height = window.innerHeight/compresion;
        if (func) {
            func()
        }
    }) 
}
const getDistans = ( x1, y1, x2, y2 ) => Math.sqrt( Math.pow((x2 - x1) , 2) + Math.pow((y2 - y1) , 2) )
 
let creatDot = (x, y, r, con) => {
    let drowDot = () => {
        con.beginPath();
        con.arc(x, y, r, 0, 2 * Math.PI, true);
        con.fill();
    }
    let sizeUpR = (R) => {
        if( !R ){
            if( r < 3 ){
                r += 0.2;
            }
        } else {
            r = R
        }
    }
    let sizeDownR = (dr) => {
        if( dr && r > 1) {
            r -= dr;
        } else if ( r > 1) {
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


export const followMe = can => {
    const context = can.getContext('2d', { alpfa: false });
    can.width =  window.innerWidth/compresion;
    can.height = window.innerHeight/compresion;
    let dots = [];
    const initBoard = () => {
        dots = [];
        for( let i = 10; i < can.width; i += 10){
            for( let j = 10; j < can.height; j += 10) {
                dots.push( creatDot(i, j, 1, context) );
            }
        }
    }
    let pastTime = 0;
    let id = null;
    let animate = (t) => {
        id = requestAnimationFrame(animate);
        if(t - pastTime < 1000 / 100) return;
        context.clearRect(0, 0, can.width, can.height);
        context.fillStyle = colors.dots;
        dots.forEach(dot => {
            if(getDistans(dot.getX(), dot.getY(), cursor.x, cursor.y%window.innerHeight) < (40) ) {
                dot.sizeUpR()
            } else {
                dot.sizeDownR()
            }
            dot.drowDot()
        })
    }
    const cancel_animation = () => {
        cancelAnimationFrame(id);
    }
    return {
        animate,
        cancel_animation,
        initBoard,
    }
}
export const wave = can => {
    const context = can.getContext('2d', { alpfa: false });
    can.width =  window.innerWidth/compresion;
    can.height = window.innerHeight/compresion;
    let dots = [];
    let columnR, columnL;
    window.addEventListener('mousemove', e => {
        if(can.parentElement.classList.contains('focuse')) 
        cursor = getMousePos(can, e)    // canvas is a backround Z-index lower then window 
    })
    const initBoard = () => {
        dots = [];
        columnL = 0;
        columnR = 0;
        for( let i = 10; i < can.width; i += 10){
            for( let j = 10; j < can.height; j += 10) {
                dots.push( creatDot(i, j, 1, context) );
            }
        }

    }
    let pastTime = 0;
    let id = null;
    let animate = (t) => {
        id = requestAnimationFrame(animate);
        if(t - pastTime < 1000 / 100) return;
        context.clearRect(0, 0, can.width, can.height);
        context.fillStyle = colors.dots;
        if( columnR > can.width) { columnR = 0; }
        if( columnL < 0 ) { columnL = can.width; }
        columnR += 4;
        columnL -= 4;
        dots.forEach( dot => {
            if( (getDistans(dot.getX(), 0, columnR , 0)  < 25) ||
             (getDistans(dot.getX(), 0, columnL , 0)  < 25) ){
                dot.sizeUpR();
            } else {
                dot.sizeDownR();
            }
            dot.drowDot()
        })
    }
    const cancel_animation = () => {
        cancelAnimationFrame(id);
    }
    return {
        animate,
        cancel_animation,
        initBoard,
    }
}
export const heart = can => {
    const context = can.getContext('2d', { alpfa: false });
    can.width =  window.innerWidth/compresion;
    can.height = window.innerHeight/compresion;
    let dots = [];
    let first, secound;
    const midle = { x:0, y:0 }

    const initBoard = () => {
        dots = [];
        first = 0;
        secound = can.width > can.height ? -(can.height / 4) : -(can.width / 4);
        midle.x = can.width / 2;
        midle.y = can.height / 2;
        for( let i = 10; i < can.width; i += 10){
            for( let j = 10; j < can.height; j += 10) {
                dots.push( creatDot(i, j, 1, context) );
            }
        }

    }
    let pastTime = 0;
    let id = null;
    context.fillStyle = colors.dots;

    let animate = (t) => {
        id = requestAnimationFrame(animate);
        
        if(t - pastTime < 1000 / 100) return;
        context.clearRect(0, 0, can.width, can.height);
        
        first++;
        secound++;
        if (first > can.width / 2 || first > can.height / 2 ){
            first = 0;
        }
        if (secound > can.width / 2 || secound > can.height / 2 ){
            secound = 0;
        }
        
        dots.forEach( dot => {
            if (getDistans(dot.getX(), dot.getY(), midle.x, midle.y) < first &&
                getDistans(dot.getX(), dot.getY(), midle.x, midle.y) > first - 20 ||
                getDistans(dot.getX(), dot.getY(), midle.x, midle.y) < secound &&
                getDistans(dot.getX(), dot.getY(), midle.x, midle.y) > secound - 20 ){
                    dot.sizeUpR()
            } else {
                dot.sizeDownR()
            }
            dot.drowDot()
        })
    }
    const cancel_animation = () => {
        cancelAnimationFrame(id);
    }
    return {
        animate,
        cancel_animation,
        initBoard,
    }
}

export const ballAnim = can => {
    const context = can.getContext('2d', { alpfa: false });
    can.width =  window.innerWidth/compresion;
    can.height = window.innerHeight/compresion;
    let dots = [];
    const space = 10;
    let ball = { 
        x: Math.floor(can.width/2),
        y: Math.floor(can.height/2),
        speed: 150, 
        dx:0, 
        dy:0,
        r: 3 * space
    }
    const initBoard = () => {
        dots = [];
        ball.dx = Math.random() * 2 - 1;
        ball.dy = Math.random() * 2 - 1;
        for( let i = space; i < can.width; i += space){
            for( let j = space; j < can.height; j += space) {
                dots.push( creatDot(i, j, 1, context) );
            }
        }
    }
    let pastTime = 0;
    let id = null;
    let animate = (t) => {
        id = requestAnimationFrame(animate);
        
        if(t - pastTime < 1000 / 100) return;
        context.clearRect(0, 0, can.width, can.height);
        context.fillStyle = colors.dots;
        
        let speed = Math.floor(ball.speed * ( t - pastTime) / 1000);
        // console.log(speed)
        ball.x += ball.dx * speed;
        ball.y += ball.dy * speed;
        if(ball.x + ball.r >= can.width  || ball.x - ball.r <= 0 ){
            ball.dx = -ball.dx
            ball.x = ball.x + ball.r >= can.width ? (can.width - ball.r - 1) : (ball.r + 1)
        }
        if(ball.y + ball.r >= can.height  || ball.y - ball.r <= 0 ){
            ball.dy = -ball.dy
            ball.y = ball.y + ball.r >= can.height ? (can.height - ball.r - 1) : (ball.r + 1)
        }
        // console.log(ball.x, ball.y)
        dots.forEach( dot => {
            if ( getDistans(dot.getX(), dot.getY(), ball.x, ball.y) < ball.r ) {
                dot.sizeUpR(2)
            } else {
                dot.sizeDownR(1)
            }
            dot.drowDot()
        })
        pastTime = t;
    }
    const cancel_animation = () => {
        cancelAnimationFrame(id);
    }
    return {
        animate,
        cancel_animation,
        initBoard,
    }
}
export const fff = can => {
    const context = can.getContext('2d', { alpfa: false });
    can.width =  window.innerWidth/compresion;
    can.height = window.innerHeight/compresion;
    let dots = [];

    const initBoard = () => {
        dots = [];
        for( let i = 10; i < can.width; i += 10){
            for( let j = 10; j < can.height; j += 10) {
                dots.push( creatDot(i, j, 1, context) );
            }
        }
    }
    let pastTime = 0;
    let id = null;
    let animate = (t) => {
        id = requestAnimationFrame(animate);
        
        if(t - pastTime < 1000 / 100) return;
        context.clearRect(0, 0, can.width, can.height);
        context.fillStyle = colors.dots;
        dots.forEach( dot => {
            if (Math.random() > 0.8 ) {
                dot.sizeUpR()
            } else {
                dot.sizeDownR()
            }
            dot.drowDot()
        })
    }
    const cancel_animation = () => {
        cancelAnimationFrame(id);
    }
    return {
        animate,
        cancel_animation,
        initBoard,
    }
}



const aim10 = can => {
    const context = can.getContext('2d');
    can.width = window.innerWidth;
    can.height = window.innerHeight;
    window.addEventListener('mousemove', e => {
        if(can.parentElement.classList.contains('focuse'))
        cursor = getMousePos(can, e)    // canvas is a backround Z-index lower then window 
    })

    ifResize(can)

    const target = ( x, y, numRings) => {
        for( let n = 0; n < numRings; n++ ){
            context.beginPath();
            context.arc(x, y, n * 10 + 10, 0, Math.PI * 2);
            context.stroke();
        }
        // context.fillStyle = colors.dots;
        context.font='10px sans-serif';
        context.strokeText('SHOOT ME', x -25, y + 50);
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

