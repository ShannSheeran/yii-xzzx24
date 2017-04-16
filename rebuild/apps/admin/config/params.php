<?php

return [
    'menu_config' => [
        [
            'title' => '商品管理',
            'en_title' => 'goods_manage',
            'url' => ['goods/show-list'],
            'permission' => ['manager'],
            'icon_class' => 'star', //菜单的图标,参照 http://fontawesome.io/icons/ 图标右边的名字写到这里即可,大部分可用
            'child' => [
                [
                    'title' => '商品列表',
                    'en_title' => 'goods_list',
                    'url' => ['goods/show-list'],
                    'permission' => ['manager'],
                    'icon_class' => 'star-o',
                ],
                [
                    'title' => '商品分类管理',
                    'en_title' => 'goods_category',
                    'url' => ['category/show-categroy'],
                    'permission' => ['manager'],
                    'icon_class' => 'star-o',
                ],
                [
                    'title' => '品牌管理',
                    'en_title' => 'brand_list',
                    'url' => ['brand/show-brand'],
                    'permission' => ['manager'],
                    'icon_class' => 'star-o',
                ],
                [
                    'title' => '国家/地区管理',
                    'en_title' => 'country_list',
                    'url' => ['country/show-country'],
                    'permission' => ['manager'],
                    'icon_class' => 'star-o',
                ],
            ],
        ],
        [
            'title' => '属性管理',
            'en_title' => 'attribute_list',
            'url' => ['attribute/show-attribute'],
            'permission' => ['manager'],
            'icon_class' => 'star-o',
            'child' => [
                [
                    'title' => '属性分类',
                    'en_title' => 'attribute_list',
                    'url' => ['attribute/show-attribute'],
                    'permission' => ['manager'],
                    'icon_class' => 'star-o',
                ],
                [
                    'title' => '属性详情',
                    'en_title' => 'attribute_list',
                    'url' => ['attributes/show-attributes'],
                    'permission' => ['manager'],
                    'icon_class' => 'star-o',
                ]
            ]
        ],
        [
            'title' => '订单管理',
        'en_title' => 'shop_order',
        'url' => ['order/index-list'],
        'permission' => ['manager'],
        'icon_class' => 'star', //菜单的图标,参照 http://fontawesome.io/icons/ 图标右边的名字写到这里即可,大部分可用
        'child' => [
                [
                    'title' => '商城订单',
                    'en_title' => 'order_index_list',
                    'url' => ['order/index-list'],
                    'permission' => ['manager'],
                    'icon_class' => 'star-o',
                ],
                [
                    'title' => '快递管理',
                    'en_title' => 'express_index_list',
                    'url' => ['express/index-list'],
                    'permission' => ['manager'],
                    'icon_class' => 'star-o',
                ],
            ],
        ],
        [
            'title' => '用户管理',
            'en_title' => 'guess_like',
            'permission' => ['manager'],
            'icon_class' => 'star',
            'child' => [
                [
                    'title' => '级别管理',
                    'en_title' => 'level_list',
                    'url' => ['agent/show-agent'],
                    'permission' => ['manager'],
                    'icon_class' => 'star-o',
                ],
                [
                    'title' => '用户管理',
                    'en_title' => 'level_list',
                    'url' => ['member/show-member'],
                    'permission' => ['manager'],
                    'icon_class' => 'star-o',
                ],
            ],
        ],
    ],
];
