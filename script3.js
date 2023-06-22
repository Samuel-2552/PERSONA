// Confetti - modified from: https://github.com/daniel-lundin/dom-confetti
var defaultColors = ['#a17fb9', '#5ec2de', '#ef3e4c', '#54c26f', '#efac1f'];

function createElements(root, elementCount, colors, width, height) {
    return Array.from({
        length: elementCount,
    }).map(function (_, index) {
        var element = document.createElement('div');
        var color = colors[index % colors.length];
        element.style['background-color'] = color; // eslint-disable-line space-infix-ops

        element.style.width = width;
        element.style.height = height;
        element.style.position = 'absolute';
        element.style.willChange = 'transform, opacity';
        element.style.visibility = 'hidden';
        root.appendChild(element);
        return element;
    });
}

function randomPhysics(angle, spread, startVelocity, random) {
    var radAngle = angle * (Math.PI / 180);
    var radSpread = spread * (Math.PI / 180);
    return {
        x: 0,
        y: 0,
        z: 0,
        wobble: random() * 10,
        wobbleSpeed: 0.1 + random() * 0.1,
        velocity: startVelocity * 0.5 + random() * startVelocity,
        angle2D: -radAngle + (0.5 * radSpread - random() * radSpread),
        angle3D: -(Math.PI / 4) + random() * (Math.PI / 2),
        tiltAngle: random() * Math.PI,
        tiltAngleSpeed: 0.1 + random() * 0.3,
    };
}

function updateFetti(fetti, progress, dragFriction, decay) {
    /* eslint-disable no-param-reassign */
    fetti.physics.x += Math.cos(fetti.physics.angle2D) * fetti.physics.velocity;
    fetti.physics.y += Math.sin(fetti.physics.angle2D) * fetti.physics.velocity;
    fetti.physics.z += Math.sin(fetti.physics.angle3D) * fetti.physics.velocity;
    fetti.physics.wobble += fetti.physics.wobbleSpeed; // Backward compatibility

    if (decay) {
        fetti.physics.velocity *= decay;
    } else {
        fetti.physics.velocity -= fetti.physics.velocity * dragFriction;
    }

    fetti.physics.y += 3;
    fetti.physics.tiltAngle += fetti.physics.tiltAngleSpeed;
    var _fetti$physics = fetti.physics;
    var x = _fetti$physics.x;
    var y = _fetti$physics.y;
    var z = _fetti$physics.z;
    var tiltAngle = _fetti$physics.tiltAngle;
    var wobble = _fetti$physics.wobble;

    var wobbleX = x + 10 * Math.cos(wobble);
    var wobbleY = y + 10 * Math.sin(wobble);
    var transform =
        'translate3d(' +
        wobbleX +
        'px, ' +
        wobbleY +
        'px, ' +
        z +
        'px) rotate3d(1, 1, 1, ' +
        tiltAngle +
        'rad)';
    fetti.element.style.visibility = 'visible';
    fetti.element.style.transform = transform;
    fetti.element.style.opacity = 1 - progress;
    /* eslint-enable */
}

function animate(root, fettis, dragFriction, decay, duration, stagger) {
    var startTime = void 0;
    return new Promise(function (resolve) {
        function update(time) {
            if (!startTime) startTime = time;
            var elapsed = time - startTime;
            var progress = startTime === time ? 0 : (time - startTime) / duration;
            fettis.slice(0, Math.ceil(elapsed / stagger)).forEach(function (fetti) {
                updateFetti(fetti, progress, dragFriction, decay);
            });

            if (time - startTime < duration) {
                requestAnimationFrame(update);
            } else {
                fettis.forEach(function (fetti) {
                    if (fetti.element.parentNode === root) {
                        return root.removeChild(fetti.element);
                    }
                });
                resolve();
            }
        }

        requestAnimationFrame(update);
    });
}

var defaults = {
    angle: 90,
    spread: 45,
    startVelocity: 45,
    elementCount: 50,
    width: '10px',
    height: '10px',
    perspective: '',
    colors: defaultColors,
    duration: 3000,
    stagger: 0,
    dragFriction: 0.1,
    random: Math.random,
};

function backwardPatch(config) {
    if (!config.stagger && config.delay) {
        config.stagger = config.delay;
    }

    return config;
}

window.confetti = function (root) {
    var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _Object$assign = Object.assign({}, defaults, backwardPatch(config));

    var elementCount = _Object$assign.elementCount;
    var colors = _Object$assign.colors;
    var width = _Object$assign.width;
    var height = _Object$assign.height;
    var perspective = _Object$assign.perspective;
    var angle = _Object$assign.angle;
    var spread = _Object$assign.spread;
    var startVelocity = _Object$assign.startVelocity;
    var decay = _Object$assign.decay;
    var dragFriction = _Object$assign.dragFriction;
    var duration = _Object$assign.duration;
    var stagger = _Object$assign.stagger;
    var random = _Object$assign.random;

    root.style.perspective = perspective;
    var elements = createElements(root, elementCount, colors, width, height);
    var fettis = elements.map(function (element) {
        return {
            element: element,
            physics: randomPhysics(angle, spread, startVelocity, random),
        };
    });
    return animate(root, fettis, dragFriction, decay, duration, stagger);
};



function throwConfetti(e) {
    // Burst of celebratory confetti!
    window.confetti(
        document.getElementById('confetti'),
        { angle: 90, spread: 180, startVelocity: 40, elementCount: 50, decay: 0.7 }
    );
    window.confetti(
        document.getElementById('topic'),
        { angle: 90, spread: 180, startVelocity: 40, elementCount: 50, decay: 0.7 }
    );
}


/* Old minified version */
/*var defaultColors=['#a17fb9','#5ec2de','#ef3e4c','#54c26f','#efac1f'],shape=function(t){var e=[function(t){var e=Math.round(10*(Math.random()+.5))+"px";return t.style.width=e,t.style.height=e,t},function(t){var e=Math.round(10*(Math.random()+.5))+"px";return t.style.width=e,t.style.height=e,t.style["border-radius"]="50%",t},function(t){var e=""+Math.round(10*(Math.random()+.5)),n=t.style["background-color"];return t.style["background-color"]="transparent",t.style["border-bottom"]=e+"px solid "+n,t.style["border-left"]=e/2+"px solid transparent",t.style["border-right"]=e/2+"px solid transparent",t.style.height=0,t.style.width=e,t}];return e[Math.floor(Math.random()*e.length)](t)};function createElements(t,e,n){return Array.from({length:e}).map(function(e,a){var r=document.createElement("div"),o=n[a%n.length];return r.style["background-color"]=o,r.style.position="absolute",t.appendChild(shape(r)),r})}function randomPhysics(t,e,n,a){var r=t*(Math.PI/180),o=e*(Math.PI/180);return{x:0,y:0,wobble:10*a(),velocity:.5*n+a()*n,angle2D:-r+(.5*o-a()*o),angle3D:-Math.PI/4+a()*(Math.PI/2),tiltAngle:a()*Math.PI}}function updateFetti(t,e,n){t.physics.x+=Math.cos(t.physics.angle2D)*t.physics.velocity,t.physics.y+=Math.sin(t.physics.angle2D)*t.physics.velocity,t.physics.z+=Math.sin(t.physics.angle3D)*t.physics.velocity,t.physics.wobble+=.1,t.physics.velocity*=n,t.physics.y+=3,t.physics.tiltAngle+=.1;var a=t.physics,r=a.x,o=a.y,i=a.tiltAngle,s=a.wobble,l="translate3d("+(r+10*Math.cos(s))+"px, "+(o+10*Math.sin(s))+"px, 0) rotate3d(1, 1, 1, "+i+"rad)";t.element.style.transform=l,t.element.style.opacity=1-e}function animate(t,e,n){var a=200,r=0;requestAnimationFrame(function o(){e.forEach(function(t){return updateFetti(t,r/a,n)}),(r+=1)<a?requestAnimationFrame(o):e.forEach(function(e){if(e.element.parentNode===t)return t.removeChild(e.element)})})}window.confetti=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=e.angle,a=void 0===n?90:n,r=e.decay,o=void 0===r?.9:r,i=e.spread,s=void 0===i?45:i,l=e.startVelocity,c=void 0===l?45:l,h=e.elementCount,d=void 0===h?50:h,y=e.colors,u=void 0===y?defaultColors:y,p=e.random,f=void 0===p?Math.random:p;animate(t,createElements(t,d,u).map(function(t){return{element:t,physics:randomPhysics(a,s,c,f)}}),o)};
*/