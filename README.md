# CA-BigDavid-V2
A system for selling and buying criminal stuff.

- To change the name of the Money Roll item, use VS Code, search for 'cash_roll', replace it with the Money Roll item name on your server and that set.

- or

- add this to qb-core/shared/items.lua
```
['cash_roll']                        = {['name'] = 'cash_roll',                        ['label'] = 'cashroll',                  ['weight'] = 0,            ['type'] = 'item',         ['image'] = 'cashroll.png',                ['unique'] = false,          ['useable'] = true,      ['shouldClose'] = true,      ['combinable'] = nil,   ['description'] = 'A cashroll of dirty money'},
```

# Preview
<img width="1283" height="769" alt="image" src="https://github.com/user-attachments/assets/80e89ef3-b119-420b-ac75-1b38f4f85c58" />
