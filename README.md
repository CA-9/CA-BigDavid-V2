# CA-BigDavid-V2
A system for selling and buying criminal stuff.

- To change the name of the Money Roll item, use VS Code, find it, and then replace it with the Money Roll item name on your server.

- or

- add this to qb-core/shared/items.lua

['cash_roll']                        = {['name'] = 'cash_roll',                        ['label'] = 'cashroll',                  ['weight'] = 0,            ['type'] = 'item',         ['image'] = 'cashroll.png',                ['unique'] = false,          ['useable'] = true,      ['shouldClose'] = true,      ['combinable'] = nil,   ['description'] = 'A cashroll of dirty money'},
