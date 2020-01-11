const Edbox = {};
function translateItemsArray(inList, mode) {
    var props = "";
    var list = new Array();
    if (mode === "in") {
        for (var key in inList) {
            list[key] = new Object();
            list[key].app_id = (Edbox.GameId || "") + "";
            if (typeof inList[key].Props !== "string") {
                props = JSON.stringify(inList[key].Props);
                if (props.length > 512) {
                    console.error("props length over 512");
                    list[key].props = "";
                }
                list[key].props = props;
            }
            list[key].type_id = inList[key].TypeId || "";
            list[key].item_name = inList[key].ItemName || "";
            list[key].item_level = inList[key].ItemLevel || 0;
            list[key].price = inList[key].Price || 0;
            list[key].ed_price = inList[key].EdPrice || 0;
            list[key].hero_level = inList[key].HeroLevel || 0;
            list[key].freeze_duration = inList[key].FreezeDuration || 0;
            list[key].sex = inList[key].Sex || 0;
            list[key].profession_type_id = inList[key].ProfessionTypeId || 0;
            list[key].resource_id = inList[key].ResourceId || 0;
            list[key].item_desc = inList[key].ItemDesc || "";
            list[key].res_guid = inList[key].ResGuid || "";
            list[key].icon_guid = inList[key].IconGuid || "";
            list[key].max_num = inList[key].MaxNum || 0;
            list[key].name_key = inList[key].NameKey || "";
            list[key].desc_key = inList[key].DescKey || "";
            list[key].icon_url = inList[key].IconUrl || "";
            list[key].rarity = inList[key].Rarity || 0;
            list[key].duration = inList[key].Duration || 0;
        }
    }
    if (mode === "out") {
        for (var skey in inList) {
            list[skey] = new Object();
            list[skey].TypeId = inList[skey].type_id;
            list[skey].ItemName = inList[skey].item_name;
            list[skey].ItemLevel = inList[skey].item_level;
            list[skey].Price = inList[skey].price;
            list[skey].EdPrice = inList[skey].ed_price;
            list[skey].HeroLevel = inList[skey].hero_level;
            list[skey].FreezeDuration = inList[skey].freeze_duration;
            list[skey].Sex = inList[skey].sex;
            list[skey].ProfessionTypeId = inList[skey].profession_type_id;
            list[skey].ResourceId = inList[skey].resource_id;
            list[skey].ItemDesc = inList[skey].item_desc;
            list[skey].ResGuid = inList[skey].res_guid;
            list[skey].IconGuid = inList[skey].icon_guid;
            list[skey].MaxNum = inList[skey].max_num;
            list[skey].NameKey = inList[skey].name_key;
            list[skey].DescKey = inList[skey].desc_key;
            list[skey].IconUrl = inList[skey].icon_url;
            list[skey].Rarity = inList[skey].rarity;
            list[skey].Duration = inList[skey].duration;
            try {
                list[skey].Props = JSON.parse(inList[skey].props);
            } catch (err) {
                list[skey].Props = {};
            }
        }
    }
    return list;
}
const testList = [
    {
        app_id: "13",
        type_id: "53c0b280-3100-11ea-9d9b-ef9fbf745e4b",
        item_name: "默认飞刀",
        item_level: 0,
        price: 0,
        ed_price: 0,
        hero_level: 0,
        freeze_duration: 0,
        sex: 0,
        profession_type_id: 0,
        props: '{"Speed":100.0}',
        resource_id: 0,
        item_desc: "描述",
        res_guid: "",
        icon_guid: "3272ab61-0f44-44cd-94df-46e5870b8155",
        max_num: 0,
        name_key: "",
        desc_key: "",
        icon_url: "",
        rarity: 0,
        duration: 0,
        is_del: 0
    }
];
const testList2 = [
    {
        TypeId: "53c0b280-3100-11ea-9d9b-ef9fbf745e4b",
        ItemName: "默认飞刀",
        ItemLevel: 0,
        Price: 0,
        EdPrice: 0,
        HeroLevel: 0,
        FreezeDuration: 0,
        Sex: 0,
        ProfessionTypeId: 0,
        ResourceId: 0,
        ItemDesc: "描述",
        ResGuid: "",
        IconGuid: "3272ab61-0f44-44cd-94df-46e5870b8155",
        MaxNum: 0,
        NameKey: "",
        DescKey: "",
        IconUrl: "",
        Rarity: 0,
        Duration: 0,
        Props: { Speed: 100 }
    }
];
console.log(translateItemsArray(testList, "out"));
console.log(translateItemsArray(testList2, "in"));
