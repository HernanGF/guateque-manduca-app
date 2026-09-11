import { MenuData } from "./types";

export const INITIAL_MENU_DATA: MenuData = {
  "business": {
    "id": "biz_1",
    "name": "Guateque Manduca",
    "description": "Cocina de autor, Servicio de Catering y Viandas envasadas al vacío. Hacé tu pedido online fácil y rápido!!!",
    "bannerUrl": "https://assets.olaclick.app/companies/backgrounds/df048b41-5640-4334-887e-ac3d93aa45a7.jpeg",
    "logoUrl": "https://assets.olaclick.app/companies/logos/36302785-857e-485f-840b-5ca9e02dea35.jpeg",
    "whatsappPhone": "5491134501611",
    "address": "Villa Madero",
    "hours": "Lunes a Domingo: 08 a 23:30",
    "currency": "$",
    "deliveryAvailable": true,
    "takeawayAvailable": true
  },
  "categories": [
    {
      "id": "cat_los-mas-elegidos",
      "name": "Los más elegidos!!!",
      "order": 1,
      "isVisible": true,
      "isFeatured": true
    },
    {
      "id": "cat_catering",
      "name": "Catering",
      "order": 2,
      "isVisible": true,
      "isFeatured": true
    },
    {
      "id": "cat_box-de-viandas-super-precios",
      "name": "Box de Viandas SUPER PRECIOS!!",
      "order": 3,
      "isVisible": true,
      "isFeatured": false
    },
    {
      "id": "cat_viandas-envasadas-al-vacio",
      "name": "Viandas envasadas al vacío",
      "order": 4,
      "isVisible": true,
      "isFeatured": false
    },
    {
      "id": "cat_menu-ejecutivo",
      "name": "Menú Ejecutivo",
      "order": 5,
      "isVisible": true,
      "isFeatured": false
    },
    {
      "id": "cat_guarniciones",
      "name": "Guarniciones",
      "order": 6,
      "isVisible": true,
      "isFeatured": false
    }
  ],
  "modifierGroups": [
    {
      "id": "mod_a2942c42-d16a-4129-b894-72637b8a4f9d",
      "name": "Elige tus salsas incluidas",
      "condition": "required",
      "selectionType": "multiple",
      "minSelect": 1,
      "maxSelect": 2,
      "options": [
        {
          "id": "opt_a2942c42-d597-46e5-bc25-bfb890acda97",
          "name": "Alioli",
          "price": 0,
          "isVisible": true
        },
        {
          "id": "opt_a2942c42-da2a-4312-bf8b-9bb095dde4c1",
          "name": "Criolla",
          "price": 0,
          "isVisible": true
        },
        {
          "id": "opt_a2942c42-d7db-428e-a60c-0032b79064f0",
          "name": "Mostaza a la Miel",
          "price": 0,
          "isVisible": true
        },
        {
          "id": "opt_a2a2e407-b8f2-4ce3-b98a-28e636fed6c1",
          "name": "Cebolla Caramelizada",
          "price": 0,
          "isVisible": true
        },
        {
          "id": "opt_a2945925-3363-4f3f-a95b-e30733fa9504",
          "name": "BBQ",
          "price": 0,
          "isVisible": true
        },
        {
          "id": "opt_a294a13b-bee5-4773-8d21-44e602e48fff",
          "name": "Chimi de Hierbas",
          "price": 0,
          "isVisible": true
        }
      ]
    },
    {
      "id": "mod_a294a040-bafc-4c28-af02-9888ca0128b1",
      "name": "Salsas EXTRA",
      "condition": "optional",
      "selectionType": "multiple",
      "minSelect": 1,
      "maxSelect": 10,
      "options": [
        {
          "id": "opt_a294a041-529d-4cb9-940c-05dbe1326836",
          "name": "Alioli (250 gr.)",
          "price": 7000,
          "isVisible": true
        },
        {
          "id": "opt_a294a041-f326-43bc-9e8b-0e0c8f1d710f",
          "name": "Mostaza a la Miel (250gr.)",
          "price": 7000,
          "isVisible": true
        },
        {
          "id": "opt_a294a3b8-40f4-44a0-87be-0b51dbefd434",
          "name": "Cebolla Caramelizada (250 gr.)",
          "price": 7000,
          "isVisible": true
        },
        {
          "id": "opt_a2a2e495-32d1-4329-85c5-56a4a8792727",
          "name": "Criolla (250 gr.)",
          "price": 7000,
          "isVisible": true
        },
        {
          "id": "opt_a2a2e4d6-591b-4992-b308-caf093dc2a77",
          "name": "Berenjenas ahumada (250 gr.)",
          "price": 7000,
          "isVisible": true
        },
        {
          "id": "opt_a2a2e4fe-9831-4241-b53f-c98a6ec7e2b7",
          "name": "BBQ (250 gr.)",
          "price": 7000,
          "isVisible": true
        },
        {
          "id": "opt_a2a2e522-858e-4b3a-9fe0-cc2cf9c6f4a8",
          "name": "Queso Azul (250 gr.)",
          "price": 7000,
          "isVisible": true
        },
        {
          "id": "opt_a2a2e544-4137-451e-98ce-c7031194d486",
          "name": "Mayonesa de Albahaca (250 gr.)",
          "price": 7000,
          "isVisible": true
        },
        {
          "id": "opt_a2a31666-0040-4495-a89d-0cdb67af0c5a",
          "name": "Chutney de Tomates (250 gr.)",
          "price": 7000,
          "isVisible": true
        },
        {
          "id": "opt_a2a31692-0b69-43c8-82aa-70f1db0bba03",
          "name": "Chutney de Morrones (250 gr.)",
          "price": 7000,
          "isVisible": true
        },
        {
          "id": "opt_a2a316c1-5bf0-4fb4-88d3-1f2b43f7361c",
          "name": "Tártara (250 gr.)",
          "price": 7000,
          "isVisible": true
        },
        {
          "id": "opt_a2a31809-1c66-4538-92b7-838bbac6dfa4",
          "name": "Picante de Jalapeños (150 gr.)",
          "price": 5000,
          "isVisible": true
        }
      ]
    },
    {
      "id": "mod_a2a259da-1312-4b5c-b51a-84e2d1a5593b",
      "name": "Guarniciones",
      "condition": "required",
      "selectionType": "single",
      "minSelect": 1,
      "maxSelect": 1,
      "options": [
        {
          "id": "opt_a2a259da-ab68-4bff-a99b-8d40a3da0f45",
          "name": "Papas a la Portuguesa",
          "price": 0,
          "isVisible": true
        },
        {
          "id": "opt_a2a259db-792e-4b94-89fd-cab05e4cfe36",
          "name": "Puré de Papas",
          "price": 0,
          "isVisible": true
        },
        {
          "id": "opt_a2a25a19-1402-4721-951f-f5015b78d5a9",
          "name": "Papas y Batatas al horno",
          "price": 0,
          "isVisible": true
        }
      ]
    }
  ],
  "products": [
    {
      "id": "prod_1789141313893",
      "name": "Ejecutivo",
      "description": "1 Tarta individual de Acelga\n1 Tarta individual de Pollo\n1 Tarta individual de Calabaza y Pollo\n1 Pechuga de Pollo al Verdeo con Papas al Horno\n1 Tortilla de Papas\nProductos envasados al vacío y congelados.",
      "imageUrl": "data:image/jpeg;base64,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",
      "categoryIds": [
        "cat_box-de-viandas-super-precios"
      ],
      "priceType": "simple",
      "simplePrice": 39000,
      "clientNote": "",
      "variants": [
        {
          "id": "var_1",
          "name": "Porción individual",
          "price": 0,
          "isVisible": true
        },
        {
          "id": "var_2",
          "name": "Porción para compartir",
          "price": 0,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isHidden": false,
      "isDiscontinued": false,
      "isFeatured": true,
      "order": 0
    },
    {
      "id": "prod_a2945757-e4a7-4cdd-87a6-c28564d14337",
      "name": "Pernil de Cerdo",
      "description": "Pernil de Cerdo horneado con dos Salsas y Figacitas",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/64e8f102-6278-4a6c-b69d-1129d0538b07.jpeg",
      "categoryIds": [
        "cat_los-mas-elegidos",
        "cat_catering"
      ],
      "priceType": "variants",
      "simplePrice": 80000,
      "clientNote": "",
      "variants": [
        {
          "id": "var_a2945757-e873-4297-a579-b420608bdf67",
          "name": "30 Sanguchitos (RINDE)",
          "price": 80000,
          "isVisible": true
        },
        {
          "id": "var_a294f484-3329-4b61-95fd-4ccd77949e89",
          "name": "50 Sanguchitos (RINDE)",
          "price": 120000,
          "isVisible": true
        },
        {
          "id": "var_a294f4dc-23e5-4501-a77c-ec80367b4d34",
          "name": "80 Sanguchitos (RINDE)",
          "price": 165000,
          "isVisible": true
        },
        {
          "id": "var_a295068e-569e-4dd2-8ef3-354ef999d71e",
          "name": "Presupuesto Personalizado",
          "price": 0,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [
        "mod_a2942c42-d16a-4129-b894-72637b8a4f9d",
        "mod_a294a040-bafc-4c28-af02-9888ca0128b1"
      ],
      "isHidden": false,
      "isDiscontinued": false,
      "isFeatured": true,
      "order": 1
    },
    {
      "id": "prod_a29457ed-4505-41cc-a962-4bf726f514d6",
      "name": "Ternera braseada",
      "description": "Ternera braseada desmechada con 2 salsas y figacitas.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/8ecefbfa-7ec9-4d40-ac78-f138f940506a.jpeg",
      "categoryIds": [
        "cat_los-mas-elegidos",
        "cat_catering"
      ],
      "priceType": "variants",
      "simplePrice": 100000,
      "variants": [
        {
          "id": "var_a29457ed-4737-4100-8f4e-c4a055c56f56",
          "name": "30 Sanguchitos (RINDE)",
          "price": 100000,
          "isVisible": true
        },
        {
          "id": "var_a2950326-347e-4bd2-89a3-eafa8b4948d3",
          "name": "45 Sanguchitos (RINDE)",
          "price": 145000,
          "isVisible": true
        },
        {
          "id": "var_a29503ab-f64f-449d-a7f3-aa9d999debcb",
          "name": "60 Sanguchitos (RINDE)",
          "price": 185000,
          "isVisible": true
        },
        {
          "id": "var_a2950649-71ed-40cc-806f-e35cb6e1f25e",
          "name": "Presupuesto Personalizado",
          "price": 0,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": true,
      "order": 2
    },
    {
      "id": "prod_a294a289-7b98-47c1-ae17-af7157125fcc",
      "name": "Pulled Pork",
      "description": "Cerdo braseado y desmechado con dos Salsas y Figacitas.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/95079e61-0d0b-4a3e-9c24-3d7021ab5ac1.jpeg",
      "categoryIds": [
        "cat_los-mas-elegidos",
        "cat_catering",
        "cat_viandas-envasadas-al-vacio"
      ],
      "priceType": "variants",
      "simplePrice": 75000,
      "variants": [
        {
          "id": "var_a294a289-7f3c-4a9d-9bf2-6351b52259f6",
          "name": "30 Sanguchitos (RINDE)",
          "price": 75000,
          "isVisible": true
        },
        {
          "id": "var_a2a2e813-5a4b-437a-9e4f-7a44627b446e",
          "name": "45 Sanguchitos (RINDE)",
          "price": 115000,
          "isVisible": true
        },
        {
          "id": "var_a2a2e88d-5d46-4eb0-a37d-aeb3806d36d2",
          "name": "60 Sanguchitos (RINDE)",
          "price": 160000,
          "isVisible": true
        },
        {
          "id": "var_a2a2ecd4-f2f5-4296-9f41-3ebd14822724",
          "name": "PRESUPUESTO PERSONALIZADO",
          "price": 0,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": true,
      "order": 3
    },
    {
      "id": "prod_a2a2d6e2-be19-458b-a3df-6205d0e3d625",
      "name": "Bodegón (4 viandas)",
      "description": "1 Bondiola a la Cerveza negra con Papas y Batatas.\n1 Pata y Muslo con Papas a la Portuguesa\n1 Canelones de ricota y espinaca con Salsa Bolognesa\n1 Ñoquis de papa con Bolognesa\nProducto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/3a1ce482-9ee6-45b2-8b57-282ed63c1227.jpg",
      "categoryIds": [
        "cat_los-mas-elegidos",
        "cat_box-de-viandas-super-precios"
      ],
      "priceType": "simple",
      "simplePrice": 49000,
      "variants": [
        {
          "id": "var_a2a2d6e2-c0d2-4229-b7e1-81c8b32345e8",
          "name": "Porción",
          "price": 49000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": true,
      "order": 4
    },
    {
      "id": "prod_a29ed46a-0618-4e7c-9c95-0d131d1f8aa2",
      "name": "Tarta de Calabaza y Pollo",
      "description": "Tarta individual de zapallo Cabutia con cebolla, puerro, pollo y queso. (300 gr.) Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/0a8b45dd-cd7a-48a4-bbf2-e7b7ffe1c63f.jpeg",
      "categoryIds": [
        "cat_los-mas-elegidos",
        "cat_viandas-envasadas-al-vacio"
      ],
      "priceType": "simple",
      "simplePrice": 8000,
      "variants": [
        {
          "id": "var_a29ed46a-0876-4ee6-8f7d-df175682cd2c",
          "name": "Porción",
          "price": 8000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": true,
      "order": 5
    },
    {
      "id": "prod_a29ed213-a380-48f4-b747-95cc2a551fa3",
      "name": "Tarta de Acelga",
      "description": "Tarta individual de Acelga con cebolla, morrón, y queso. (300 gr.) Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/23b88492-9bed-4113-a1b6-97711492c0cc.jpeg",
      "categoryIds": [
        "cat_los-mas-elegidos",
        "cat_viandas-envasadas-al-vacio"
      ],
      "priceType": "simple",
      "simplePrice": 7000,
      "variants": [
        {
          "id": "var_a29ed213-a68f-46e3-a654-f49ba5e88ba1",
          "name": "Porción",
          "price": 7000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": true,
      "order": 6
    },
    {
      "id": "prod_a294a4ba-a1cb-476a-9402-f259b486a156",
      "name": "Pechito de Cerdo BBQ",
      "description": "Pechito de Cerdo horneado a baja temperatura con salsa BBQ",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/e68a4dda-84c2-4fad-a6d2-87dcd72edd62.jpeg",
      "categoryIds": [
        "cat_los-mas-elegidos",
        "cat_catering"
      ],
      "priceType": "variants",
      "simplePrice": 50000,
      "variants": [
        {
          "id": "var_a294a4ba-a35f-43b1-a317-1087b64a29da",
          "name": "Cerdo BBQ x 1 kg",
          "price": 50000,
          "isVisible": true
        },
        {
          "id": "var_a2a3002c-2152-415d-83a5-e32773bd4238",
          "name": "Cerdo BBQ x 2 kg",
          "price": 95000,
          "isVisible": true
        },
        {
          "id": "var_a2a31ee6-cb7e-4f34-ae9f-4e09dfec8ea8",
          "name": "PRESUPUESTO PERSONALIZADO",
          "price": 0,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": true,
      "order": 7
    },
    {
      "id": "prod_a2a9257e-62eb-411d-a4a4-54a7e6ce7881",
      "name": "Fetuccini con Bolognesa",
      "description": "Fetuccini artesanal de Sémola con salsa Bolognesa tradicional. Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/d34eaba3-a8f3-4716-9fce-1c42d97b81d2.jpeg",
      "categoryIds": [
        "cat_los-mas-elegidos",
        "cat_viandas-envasadas-al-vacio"
      ],
      "priceType": "simple",
      "simplePrice": 12000,
      "variants": [
        {
          "id": "var_a2a9257e-66a0-4d95-b357-2a02baf15fe0",
          "name": "Porción",
          "price": 12000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": true,
      "order": 8
    },
    {
      "id": "prod_a2a3232b-859f-4ae2-a4f7-d0d6e6d64a3f",
      "name": "Todo Pastas (4 viandas)",
      "description": "1 Cavatelli de Espinaca con Crema, Pollo y Jamón\n1 Wok estilo Oriental de Fideos con Ternera y Vegetales.\n1 Fetuccini a la Bolognesa\n1 Ñoquis de Papa a la Bolognesa\nProducto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/cea0c481-8eae-4291-8c76-2bca3e31199a.jpg",
      "categoryIds": [
        "cat_los-mas-elegidos",
        "cat_box-de-viandas-super-precios"
      ],
      "priceType": "simple",
      "simplePrice": 47000,
      "variants": [
        {
          "id": "var_a2a3232b-886f-4a62-8e9f-93001fedf4b8",
          "name": "Porción",
          "price": 47000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": true,
      "order": 9
    },
    {
      "id": "prod_a294a806-8f0e-4653-8280-e837c85d7018",
      "name": "Cavatelli de Espinaca Parisienne",
      "description": "Cavatelli de Espinaca con Salsa Parisienne (sin hongos). Incluye tenedores y cazuelas descartables",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/1eb6db17-75ab-429c-aedd-44ca09deb789.jpg",
      "categoryIds": [
        "cat_catering",
        "cat_viandas-envasadas-al-vacio"
      ],
      "priceType": "variants",
      "simplePrice": 65000,
      "variants": [
        {
          "id": "var_a294a806-9180-494e-99df-fd5f0542e668",
          "name": "15 Cazuelas  x 150 gr. (RINDE)",
          "price": 65000,
          "isVisible": true
        },
        {
          "id": "var_a294a9d6-712e-4cea-9524-cb059fa3d2d8",
          "name": "20 Cazuelas x 150 gr. (RINDE)",
          "price": 80000,
          "isVisible": true
        },
        {
          "id": "var_a294aa40-50bc-438e-871d-f7cd9a013e37",
          "name": "30 Cazuelas x 150 gr. (RINDE)",
          "price": 120000,
          "isVisible": true
        },
        {
          "id": "var_a2a45d54-495b-4e32-a9ba-43dc9c4e59f8",
          "name": "PERSUPUESTO PERSONALIZADO",
          "price": 0,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": false,
      "order": 5
    },
    {
      "id": "prod_a294ac26-758e-488d-bc57-49eaca6e3039",
      "name": "Cavatelli a la Bolognesa",
      "description": "Cavatelli con salsa Bolognesa tradicional. Incluye tenedores y cazuelas descartables",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/90b4f1e9-75fc-4ee4-9c83-df3bf657f7a1.jpg",
      "categoryIds": [
        "cat_catering"
      ],
      "priceType": "variants",
      "simplePrice": 100000,
      "variants": [
        {
          "id": "var_a294ac26-7858-4fa4-92cd-80e22bd4e22d",
          "name": "15 Cazuelas x 250 gr. (RINDE)",
          "price": 100000,
          "isVisible": true
        },
        {
          "id": "var_a294ad2d-886c-4643-8c5a-ed348c019eb6",
          "name": "20 Cazuelas x 250 gr. (RINDE)",
          "price": 130000,
          "isVisible": true
        },
        {
          "id": "var_a294ad65-26ab-464d-bfe3-d2d920421ee1",
          "name": "30 Cazuelas x 250 gr. (RINDE)",
          "price": 185000,
          "isVisible": true
        },
        {
          "id": "var_a2a45d9f-010e-4e27-a1da-b3858ecb382a",
          "name": "PRESUPUESTO PERSONALIZADO",
          "price": 0,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": false,
      "order": 6
    },
    {
      "id": "prod_a2950b31-b7d3-4201-aec7-fc1bb02325a6",
      "name": "PRESUPUESTO PERSONALIZADO",
      "description": "Diseñamos la experiencia según tus ganas. Si buscás combinar variedades de nuestra carta o necesitás ajustar porciones para tu grupo, te armamos el presupuesto a medida.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/1dd7fe05-0400-41bc-bd9a-7ce45f09a35c.jpg",
      "categoryIds": [
        "cat_catering"
      ],
      "priceType": "simple",
      "simplePrice": 0,
      "variants": [
        {
          "id": "var_a2950b31-bb73-4006-b057-c239658d877e",
          "name": "Porción",
          "price": 0,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": false,
      "order": 7
    },
    {
      "id": "prod_a2a32066-2c93-4dee-ac41-4a2f83f1122d",
      "name": "Saludable (4 viandas)",
      "description": "1 Tarta de Acelga\n1 Tarta de Acelga y Pollo\n1 Tarta de Calabaza y Pollo\n1 Wok de Arroz Chow Fan\nProducto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/6e7fe84e-d1a3-4320-8feb-0190fac944bd.jpg",
      "categoryIds": [
        "cat_box-de-viandas-super-precios"
      ],
      "priceType": "simple",
      "simplePrice": 35000,
      "variants": [
        {
          "id": "var_a2a32066-3080-44d9-b873-ea022f2928c5",
          "name": "Porción",
          "price": 35000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": true,
      "order": 2
    },
    {
      "id": "prod_a2a32170-49fa-42ce-ae83-6872c9642463",
      "name": "Todo Tartas (4 viandas)",
      "description": "1 Tarta de Acelga\n1 Tarta de Acelga y Pollo\n1 Tarta de Calabaza y Pollo\n1 Tarta de Pollo\nProducto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/e28bb0fa-7217-4630-a8f3-4ec2823b5b33.jpg",
      "categoryIds": [
        "cat_box-de-viandas-super-precios"
      ],
      "priceType": "simple",
      "simplePrice": 31000,
      "variants": [
        {
          "id": "var_a2a32170-4c6a-4bd4-926f-7d3655527875",
          "name": "Porción",
          "price": 31000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": false,
      "order": 3
    },
    {
      "id": "prod_a2a32298-95fb-4f11-93f7-729139f9b126",
      "name": "Carnes (4 viandas)",
      "description": "1 Bondiola de Cerdo a la Cerveza negra\n1 Pata y Muslo al horno\n1 Ternera braseada desmechada\n1 Pulled Pork desmechado\nProducto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/16f904c4-8fd1-4caf-9749-153b6ab8861f.jpg",
      "categoryIds": [
        "cat_box-de-viandas-super-precios"
      ],
      "priceType": "simple",
      "simplePrice": 54000,
      "variants": [
        {
          "id": "var_a2a32298-9986-4e3f-b1d2-76985efce021",
          "name": "Porción",
          "price": 54000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": false,
      "order": 4
    },
    {
      "id": "prod_a2a32471-a9ae-4331-a9d9-907eaa34704a",
      "name": "Oriental (4 viandas)",
      "description": "2 Wok de Arroz Chow Fan con Pollo, Huevo y Vegetales.\n2 Wok estilo Oriental de Fideos con Ternera y Vegetales.\nProducto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/bc4a610e-8766-4506-ad3b-17b9858b62e8.jpg",
      "categoryIds": [
        "cat_box-de-viandas-super-precios"
      ],
      "priceType": "simple",
      "simplePrice": 47000,
      "variants": [
        {
          "id": "var_a2a32471-aba4-4818-ab74-9816a5cf758d",
          "name": "Porción",
          "price": 47000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": false,
      "order": 6
    },
    {
      "id": "prod_a2a32580-3b53-4a4c-b8ad-4cfc9522e09f",
      "name": "Selección (4 viandas)",
      "description": "1 Raviolones de Cerdo braseado con salsa Rosa\n1 Cavatelli de Espinaca con salsa Parisienne.\n1 Canelones (2) de Ricota y Espinaca con Bolognesa.\n1 Ternera Braseada Desmechada para Sanguchitos o para una picada ( 380 gs )\nProducto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/526dd682-207f-402b-949b-59684689838c.jpg",
      "categoryIds": [
        "cat_box-de-viandas-super-precios"
      ],
      "priceType": "simple",
      "simplePrice": 53000,
      "variants": [
        {
          "id": "var_a2a32580-3e93-429e-b189-d6a7d8d78448",
          "name": "Porción",
          "price": 53000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": false,
      "order": 7
    },
    {
      "id": "prod_a2945ff7-7924-4987-8dd3-6b4ddd94b478",
      "name": "Chow Fan con Pollo",
      "description": "Arroz salteado con Huevo, pollo y Vegetales. (400 gr.) Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/bd4573d5-8700-4e7c-83ac-3059cee26a06.jpg",
      "categoryIds": [
        "cat_viandas-envasadas-al-vacio"
      ],
      "priceType": "simple",
      "simplePrice": 12000,
      "variants": [
        {
          "id": "var_a2945ff7-8538-4b1c-be46-386698ae08e8",
          "name": "Porción",
          "price": 12000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": true,
      "order": 1
    },
    {
      "id": "prod_a294d120-a646-4d06-acfd-8c4c7a421fe5",
      "name": "Wok Oriental con Ternera",
      "description": "Wok estilo Oriental de Fideos, Ternera y Vegetales. (400 gr.) Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/255f834d-fe87-4131-8006-b08a3d19c417.jpg",
      "categoryIds": [
        "cat_viandas-envasadas-al-vacio"
      ],
      "priceType": "simple",
      "simplePrice": 12000,
      "variants": [
        {
          "id": "var_a294d120-a8f8-40ce-b6fb-4179e92502a2",
          "name": "Porción",
          "price": 12000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": true,
      "order": 2
    },
    {
      "id": "prod_a29ed694-64d4-40a1-9bf4-435ba330afe8",
      "name": "Tarta de Acelga y Pollo",
      "description": "Tarta individual de Acelga, cebolla, morrón, pollo y queso. (300 gr.) Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/ed3eaa03-2d96-447f-b32d-a924440d4375.jpeg",
      "categoryIds": [
        "cat_viandas-envasadas-al-vacio"
      ],
      "priceType": "simple",
      "simplePrice": 8000,
      "variants": [
        {
          "id": "var_a29ed694-66cf-4546-b59d-8851d535cf8a",
          "name": "Porción",
          "price": 8000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": false,
      "order": 5
    },
    {
      "id": "prod_a2b33bf4-65aa-4002-aaca-c73b1bac3ca9",
      "name": "Tarta de Pollo",
      "description": "Tarta individual de Pollo con Zanahoria y Puerro. (300 gr.) Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/65c910c6-6ccb-4d64-aadd-31ed65705fed.jpeg",
      "categoryIds": [
        "cat_viandas-envasadas-al-vacio"
      ],
      "priceType": "simple",
      "simplePrice": 8000,
      "variants": [
        {
          "id": "var_a2b33bf4-6842-40fa-adce-897129e41804",
          "name": "Porción",
          "price": 8000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": false,
      "order": 6
    },
    {
      "id": "prod_a2b345ae-af4b-4dec-91e5-6b88b76bde31",
      "name": "Tortilla de Papas(copy)",
      "description": "Tortilla de Papas individual con Cebolla rehogada. Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/7a6a6735-fd89-4a4e-8b55-b6f8441f8612.jpeg",
      "categoryIds": [
        "cat_viandas-envasadas-al-vacio"
      ],
      "priceType": "simple",
      "simplePrice": 7000,
      "variants": [
        {
          "id": "var_a2b345ae-b200-47d4-9e38-8de71c234904",
          "name": "Porción",
          "price": 7000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": false,
      "order": 7
    },
    {
      "id": "prod_a29ed950-1ecc-41a9-9665-3584af39c6df",
      "name": "Canelones de Ricota y Espinaca",
      "description": "Canelones tradicionales de Ricota y Espinaca. (400 gr.) Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/9f4f3d9a-b02b-4198-8f99-1823cd93d43d.jpeg",
      "categoryIds": [
        "cat_viandas-envasadas-al-vacio"
      ],
      "priceType": "simple",
      "simplePrice": 12000,
      "variants": [
        {
          "id": "var_a29ed950-217c-4634-a582-e3f55bbc56b4",
          "name": "Porción",
          "price": 12000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": false,
      "order": 8
    },
    {
      "id": "prod_a29edbd3-46eb-4a16-8d30-ac078fb74086",
      "name": "Ñoquis con salsa Bolognesa",
      "description": "Ñoquis de Papa con salsa Bolognesa tradicional. (400 gr.) Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/46483e57-98ac-43c1-a71e-de80ed78ac37.jpeg",
      "categoryIds": [
        "cat_viandas-envasadas-al-vacio"
      ],
      "priceType": "simple",
      "simplePrice": 12000,
      "variants": [
        {
          "id": "var_a29edbd3-488f-4b0a-aa7b-8f1a8e7dd23b",
          "name": "Porción",
          "price": 12000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": false,
      "order": 9
    },
    {
      "id": "prod_a29ede3d-0d0a-40eb-a40b-cfca5ea5b617",
      "name": "Bondiola a la Cerveza negra",
      "description": "Bondiola a la cerveza negra en cocción a baja temperatura con cebollas, apio y zanahoria. Acompañada de papas y batatas horneadas. (400 gr.) Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/14325174-b11b-41af-92b3-fb96e39c3b8c.jpg",
      "categoryIds": [
        "cat_viandas-envasadas-al-vacio"
      ],
      "priceType": "simple",
      "simplePrice": 12000,
      "variants": [
        {
          "id": "var_a29ede3d-0f01-48ea-9cc5-f9b5e06c739e",
          "name": "Porción",
          "price": 12000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": false,
      "order": 10
    },
    {
      "id": "prod_a29ee5ff-ca3b-437a-a2c2-c0aee15c30dd",
      "name": "Raviolones de Cerdo con salsa Rosa",
      "description": "Raviolones de Cerdo braseado con salsa Rosa. (400 gr.) Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/4905bee1-fc48-45f6-a60c-780d72d5d1f5.jpeg",
      "categoryIds": [
        "cat_viandas-envasadas-al-vacio"
      ],
      "priceType": "simple",
      "simplePrice": 12000,
      "variants": [
        {
          "id": "var_a29ee5ff-cc5f-40a4-98ab-ccc5788a751d",
          "name": "Porción",
          "price": 12000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": false,
      "order": 11
    },
    {
      "id": "prod_a2a256c6-7a66-46e7-a179-9e06f1fe7048",
      "name": "Ñoquis de Calabaza con Bolognesa",
      "description": "Ñoquis de Cabutia con salsa Bolognesa tradicional. (400 gr.) Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/f908e351-8d48-44e0-aa79-15b80c05ac0a.jpeg",
      "categoryIds": [
        "cat_viandas-envasadas-al-vacio"
      ],
      "priceType": "simple",
      "simplePrice": 12000,
      "variants": [
        {
          "id": "var_a2a256c6-7ca7-40cf-98ad-d549c0283a0e",
          "name": "Porción",
          "price": 12000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": false,
      "order": 14
    },
    {
      "id": "prod_a2a2592c-ac81-4889-8eea-ef27b5e1b367",
      "name": "Pata y Muslo horneada c/ guarnición",
      "description": "Pata y Muslo de pollo al horno con guarnición a elección. (400 gr.) Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/48c241ae-6775-4e0b-b267-d88f8e6edb96.jpeg",
      "categoryIds": [
        "cat_viandas-envasadas-al-vacio"
      ],
      "priceType": "simple",
      "simplePrice": 12000,
      "variants": [
        {
          "id": "var_a2a2592c-aec8-4aa5-9e7b-5c5f7a5b3107",
          "name": "Porción",
          "price": 12000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [
        "mod_a2a259da-1312-4b5c-b51a-84e2d1a5593b"
      ],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": false,
      "order": 16
    },
    {
      "id": "prod_a2b342ac-fd13-453c-a4e7-8bf6103dab9e",
      "name": "Pollo al Verdeo con Papas(copy)",
      "description": "Pechuga de Pollo a la crema de Verdeo con Papas al horno. (330 gr.) Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/ad50b808-c004-4f29-a865-58e4b70d6c3a.jpeg",
      "categoryIds": [
        "cat_viandas-envasadas-al-vacio"
      ],
      "priceType": "simple",
      "simplePrice": 9000,
      "variants": [
        {
          "id": "var_a2b342ac-ff72-45cc-b903-82a87cf6cd3a",
          "name": "Porción",
          "price": 9000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": false,
      "order": 17
    },
    {
      "id": "prod_a2a25ea4-2437-4d16-85fb-11082cd61ebc",
      "name": "Ternera Braseada desmechada",
      "description": "Ternera braseada a baja temperatura y desmechada. (380 gr.) Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/3433f581-48ed-42b9-9110-2756df100366.jpeg",
      "categoryIds": [
        "cat_viandas-envasadas-al-vacio"
      ],
      "priceType": "simple",
      "simplePrice": 17000,
      "variants": [
        {
          "id": "var_a2a25ea4-267d-43d1-8827-3a92fbbcf512",
          "name": "Porción",
          "price": 17000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": false,
      "order": 18
    },
    {
      "id": "prod_a2a2632d-657f-4f9d-a8a1-d7c950459988",
      "name": "Lengua a la Vinagreta",
      "description": "Clásica Lengua tiernizada con Vinagreta y vegetales. (350 gr.) Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/5e5dfa8e-c0de-4197-8343-d8d663d3cfe3.jpeg",
      "categoryIds": [
        "cat_viandas-envasadas-al-vacio"
      ],
      "priceType": "simple",
      "simplePrice": 18000,
      "variants": [
        {
          "id": "var_a2a2632d-6b33-4a50-b966-bb206c83f153",
          "name": "Porción",
          "price": 18000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": false,
      "order": 20
    },
    {
      "id": "prod_a2b3395f-01fc-4bd7-bf8a-2e64c70cc265",
      "name": "Pollo al Verdeo con Papas",
      "description": "Pechuga de Pollo a la crema de Verdeo con Papas al horno. (330 gr.) Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/ad50b808-c004-4f29-a865-58e4b70d6c3a.jpeg",
      "categoryIds": [
        "cat_menu-ejecutivo"
      ],
      "priceType": "simple",
      "simplePrice": 9000,
      "variants": [
        {
          "id": "var_a2b3395f-0677-4a9e-bfa2-f36c4a3391eb",
          "name": "Porción",
          "price": 9000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": true,
      "order": 1
    },
    {
      "id": "prod_a2b33ba5-68de-4862-9ecc-02128fd34bba",
      "name": "Tarta de Acelga(copy)",
      "description": "Tarta individual de Acelga con cebolla, morrón, y queso. (300 gr.) Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/23b88492-9bed-4113-a1b6-97711492c0cc.jpeg",
      "categoryIds": [
        "cat_menu-ejecutivo"
      ],
      "priceType": "simple",
      "simplePrice": 7000,
      "variants": [
        {
          "id": "var_a2b33ba5-6b6f-4fde-8aa4-d402e5a1fd91",
          "name": "Porción",
          "price": 7000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": true,
      "order": 2
    },
    {
      "id": "prod_a2b33bb3-73d7-4e9c-b48d-a0904ac8ca99",
      "name": "Tarta de Calabaza y Pollo(copy)",
      "description": "Tarta individual de zapallo Cabutia con cebolla, puerro, pollo y queso. (300 gr.) Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/0a8b45dd-cd7a-48a4-bbf2-e7b7ffe1c63f.jpeg",
      "categoryIds": [
        "cat_menu-ejecutivo"
      ],
      "priceType": "simple",
      "simplePrice": 8000,
      "variants": [
        {
          "id": "var_a2b33bb3-760d-4a97-9035-610220482be6",
          "name": "Porción",
          "price": 8000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": false,
      "order": 3
    },
    {
      "id": "prod_a2b33bbc-7711-4904-aab4-4c38dc8998b3",
      "name": "Tarta de Acelga y Pollo(copy)",
      "description": "Tarta individual de Acelga, cebolla, morrón, pollo y queso. (300 gr.) Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/ed3eaa03-2d96-447f-b32d-a924440d4375.jpeg",
      "categoryIds": [
        "cat_menu-ejecutivo"
      ],
      "priceType": "simple",
      "simplePrice": 8000,
      "variants": [
        {
          "id": "var_a2b33bbc-790c-413d-9212-01853c27ec5d",
          "name": "Porción",
          "price": 8000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": false,
      "order": 4
    },
    {
      "id": "prod_a2b34219-ee7d-455c-9653-59da4c4efa42",
      "name": "Tarta de Pollo(copy)",
      "description": "Tarta individual de Pollo con Zanahoria y Puerro. (300 gr.) Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/65c910c6-6ccb-4d64-aadd-31ed65705fed.jpeg",
      "categoryIds": [
        "cat_menu-ejecutivo"
      ],
      "priceType": "simple",
      "simplePrice": 8000,
      "variants": [
        {
          "id": "var_a2b34219-f31b-45de-b679-d942e2848543",
          "name": "Porción",
          "price": 8000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": false,
      "order": 5
    },
    {
      "id": "prod_a2b3434f-17bd-435e-9f6c-2707a25f2a26",
      "name": "Tortilla de Papas",
      "description": "Tortilla de Papas individual con Cebolla rehogada. Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/7a6a6735-fd89-4a4e-8b55-b6f8441f8612.jpeg",
      "categoryIds": [
        "cat_menu-ejecutivo"
      ],
      "priceType": "simple",
      "simplePrice": 7000,
      "variants": [
        {
          "id": "var_a2b3434f-1a8e-4228-872e-16795b0484e3",
          "name": "Porción",
          "price": 7000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": false,
      "order": 6
    },
    {
      "id": "prod_a2a24fdf-4cce-4a36-b7e2-ecb53c4d07e0",
      "name": "Puré de Papas",
      "description": "Puré cremoso de Papas. (300 gr.) Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/94013e07-bc6e-4d19-9898-484fc198a97a.jpeg",
      "categoryIds": [
        "cat_guarniciones"
      ],
      "priceType": "simple",
      "simplePrice": 4000,
      "variants": [
        {
          "id": "var_a2a24fdf-4ea2-4a65-905c-d1dbb644c2c0",
          "name": "Porción",
          "price": 4000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": true,
      "order": 1
    },
    {
      "id": "prod_a2a24a55-fce1-456b-8103-0c50832cd958",
      "name": "Papas a la Portuguesa (Guarnición)",
      "description": "Papas, morrones, cebolla, tomate natural cocidos con vino blanco, caldo y sus propios jugos. Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/671d68ac-ad93-4059-98a6-11e7b5a2e0ce.jpeg",
      "categoryIds": [
        "cat_guarniciones"
      ],
      "priceType": "simple",
      "simplePrice": 4000,
      "variants": [
        {
          "id": "var_a2a24a56-00cb-4b6d-b5d5-8bc55feab346",
          "name": "Porción",
          "price": 4000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": true,
      "order": 2
    },
    {
      "id": "prod_a2a250a3-959e-4a33-a874-3e843ffa51eb",
      "name": "Papas y Batatas horneadas",
      "description": "Papas y Batatas al horno. Producto envasado al vacío y congelado.",
      "imageUrl": "https://assets.olaclick.app/companies/products/images/800/c5eb71b6-cb99-4d47-a2e9-65240f8d9824.jpeg",
      "categoryIds": [
        "cat_guarniciones"
      ],
      "priceType": "simple",
      "simplePrice": 4000,
      "variants": [
        {
          "id": "var_a2a250a3-9784-4ebe-bec8-c43dd0fd0b17",
          "name": "Porción",
          "price": 4000,
          "isVisible": true
        }
      ],
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
      "isFeatured": false,
      "order": 3
    }
  ],
  "updatedAt": 1789141412572
};
