const log = console.log;
const app = new PIXI.Application();
document.body.appendChild(app.view);

const lake = new PIXI.Graphics();
lake.interactive = true;
lake.beginFill(0x01ADFB);
lake.drawRect(0, 0, app.renderer.width, app.renderer.height);
app.stage.addChild(lake);

const ducksAndBreadContainer = new PIXI.Container();
app.stage.addChild(ducksAndBreadContainer);

const getXandYVelocity = (sprite, target, speed) =>
{
    const dx = target.x - sprite.x;
    const dy = target.y - sprite.y;
    const angle = Math.atan2(dy, dx);
    const x = Math.cos(angle) * speed;
    const y = Math.sin(angle) * speed; 
    return {x, y, dx, dy};
};

const closeEnough = (dx, dy, speed)=>
{
    if(Math.abs(dx) <= speed && Math.abs(dy) <= speed)
    {
        return true;
    }
    else
    {
        return false;
    }
};

const getDuck = parent =>
{
    const duck = new PIXI.Sprite.fromImage('./images/duck-overhead.png');
    duck.scale.set(0.2);
    parent.addChild(duck);
    duck.speed = 2;
    duck.tick = delta =>
    {
        if(duck.target)
        {
            const {x, y, dx, dy} = getXandYVelocity(duck, duck.target, duck.speed);
            if(closeEnough(dx, dy, duck.speed) == false)
            {
                duck.x += x;
                duck.y += y;
            }
            else
            {
                duck.x = duck.target.x;
                duck.y = duck.target.y;
                delete duck.target;
            }
        }
    };
    return duck;
};

const getBread = parent =>
{
    const bread = new PIXI.Sprite.fromImage('./images/bread.png');
    bread.scale.set(0.1);
    parent.addChild(bread);
    parent.setChildIndex(bread, 0);
    return bread;
};

const randomNumberFromRange = (start, end)=>
{
    const range = end - start;
    const random = Math.random() * range;
    return start + random;
};

const ducks = _.chain(new Array(5))
.map(()=> getDuck(ducksAndBreadContainer))
.map(duck => {
    duck.x = randomNumberFromRange(100, 200);
    duck.y = randomNumberFromRange(100, 200);
    return duck;
})
.value();

const breadSlices = [];

lake.on('pointerdown', event =>
{
    const {x, y} = event.data.global;
    const bread = getBread(ducksAndBreadContainer);
    bread.x = x;
    bread.y = y;
    breadSlices.push(bread);
    _.forEach(ducks, duck => duck.target = {x, y});
});

app.ticker.add(delta =>
{
    _.forEach(ducks, duck => duck.tick(delta));
});