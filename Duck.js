class Duck extends PIXI.Sprite
{
    constructor(parent=null)
    {
        super(PIXI.Texture.fromImage('./images/duck-overhead.png'));
        const me = this;
        me.scale.set(0.2);
        me.speed = 2;
        if(parent)
        {
            parent.addChild(me);
        }
    }

    getXandYVelocity(target)
    {
        const me = this;
        const dx = target.x - me.x;
        const dy = target.y - me.y;
        const angle = Math.atan2(dy, dx);
        const x = Math.cos(angle) * me.speed;
        const y = Math.sin(angle) * me.speed; 
        return {x, y, dx, dy};
    }

    closeEnough(dx, dy)
    {
        const me = this;
        if(Math.abs(dx) <= me.speed && Math.abs(dy) <= me.speed)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    eatBread(bread)
    {
        log("bread.hitPoints:", bread.hitPoints);
        bread.hitPoints--;
        if(bread.hitPoints <= 0)
        {
            const index = _.findIndex(breadSlices, slice => slice === bread);
            breadSlices.splice(index, 1);
            bread.parent.removeChild(bread);
        }
    }

    tick(delta)
    {
        const me = this;
        if(me.target)
        {
            const {x, y, dx, dy} = me.getXandYVelocity(me.target);
            if(me.target.hitPoints <= 0)
            {
                log("No bread left, giving up.");
                delete me.target;
                return;
            }
            if(me.closeEnough(dx, dy) == false)
            {
                me.x += x;
                me.y += y;
            }
            else
            {
                me.x = me.target.x;
                me.y = me.target.y;
                log("Eating some bread.");
                me.eatBread(me.target);
            }
        }
    }
}


