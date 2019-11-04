function test(val) {
    switch (true) {
        case val in a:
            console.log(val + " in a");

            return;
        case val in b:
            console.log(val + " in b");

            return;

        default:
            return;
    }
}
var a = {
    x: 1,
    y: 2
};
var b = {
    m: 1,
    n: 2
};
test("x");
test("n");
const k = {
    id: "71e42f90-fac2-11e9-96e4-0b250f0ea971",
    game_icon: "198d7ce2-24a2-4734-b2ba-7d7c6cbff355",
    game_name: "消消乐546521",
    tags: [],
    game_score: -1,
    players: 0,
    author: "林桔泉",
    author_head: "http://cs.101.com/v0.1/static/cscommon/avatar/546521/546521.jpg?size=160&t=1572835887944"
};
const w = {
    id: "30c31a40-f567-11e9-97cf-4dddc7025dab",
    game_icon: "b87538c3-1b2d-4462-84f9-6e695ca734de",
    game_name: "1571815913000",
    tags: ["教育", "体育", "解谜"],
    game_score: -1,
    players: 0,
    author: "yfb222等等4",
    author_head: "http://cs.101.com/v0.1/static/cscommon/avatar/2059159774/2059159774.jpg?size=160&t=1572836023331"
};
