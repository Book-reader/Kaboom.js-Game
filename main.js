const SPEED = 900
var spawnRate = 2;
var lazer;
var btn, player, playerHealth,Score
var scoreNum = 0

function addButton(txt, p, f) {
    
    btn = add([
        text(txt),
        pos(p),
        area({ cursor: "pointer", }),
        scale(1),
        origin("center"),
    ])

    btn.onClick(f)
}

function playGame(){
    
    kaboom();
    loadBean();
    debug.inspect = true
    
    player = add([
        sprite("bean"),
        pos(120, height() - 90),
        area(),
        health(3),
    ])
    
    score = add([
        pos(24, 48),
        text("Score:"+scoreNum, {
            size: 24,
            width: 320,
            font: "sink",
        })
    ]),

    //movement
    onKeyDown("a", () => {
        player.move(-SPEED, 0)
    })
    
    onKeyDown("d", () => {
        player.move(SPEED, 0)
    })
    
    loop(0.5, () => {
        lazer = add([
            rect(20,100),
            area(),
            solid(),
            pos(player.pos.x+player.width/2,player.pos.y-player.height),
            move(90,-1000),
            lifespan(1),
            "lazer",
        ])
    })
    
    //spawn ememy
    loadSprite("enemy", "./sprites/enemy.png");
    
    loop(spawnRate, () => {
        for(i=0;i<2;i++){
            add([
                sprite("enemy"),
                area(),
                pos(rand(0, width()),0),
                move(90,100),
                lifespan(10),
                "enemy",
                scale(5),
            ])    
        }
    })
    
    onCollide("enemy","lazer", (enemy,lazer) => {
        destroy(enemy)
        debug.log("hit")
        scoreNum+=1
        score.text = "Score:" + scoreNum
    })
    
    //powerups
    loadSprite("powerup1", "./sprites/powerup1.png");
    
    onCollide("lazer","powerup1", (lazer,powerup1) => {
        destroy(powerup1)
        debug.log("powerup1")
        for(i=0;i<100;i++){
            add([
                rect(50,50),
                color(255,0,0),
                pos(player.pos),
                move(rand(360),2000),
                area(),
                "particle1",
                lifespan(1),
            ])  
        }
    })
    
    onCollide("particle1", "enemy", (particle1,enemy) => {
        destroy(enemy)
        scoreNum+=1
        score.text = "Score:" + scoreNum
    })
    
    loop(rand(10,20), () => {
        add([
            sprite("powerup1"),
            area(),
            pos(rand(0, width()),0),
            move(90,100),
            lifespan(10),
            "powerup1",
            scale(2),
        ])
    })
    
    
    //player health

    player.onCollide("enemy", (enemy) => {
        player.hurt(1)
        playerHealth.text = "Health:" + player.hp()
        enemy.destroy()
        if(player.hp()<=0){
            deathScreen()
        }
    })
    
    playerHealth = add([
        pos(24, 24),
        text("Health:"+player.hp(), {
            size: 24,
            width: 320,
            font: "sink",
        }),
    ])
}


function deathScreen(){
    addButton("You Died, Restart?", vec2(width()/2, height()/2), () => debug.log("not implemented yet"))
}