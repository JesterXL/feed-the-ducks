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

const getDuck = parent => new Duck(parent);

const getBread = parent =>
{
    const bread = new PIXI.Sprite.fromImage('./images/bread.png');
    bread.scale.set(0.1);
    bread.hitPoints = 3;
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
    _.forEach(ducks, duck => duck.target = bread);
});

app.ticker.add(delta =>
{
    _.forEach(ducks, duck => duck.tick(delta));
});