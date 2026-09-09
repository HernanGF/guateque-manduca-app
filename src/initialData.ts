import { MenuData } from "./types";

export const INITIAL_MENU_DATA: MenuData = {
  "business": {
    "id": "biz_1",
    "name": "Guateque Manduca",
    "description": "Cocina artesanal, viandas frescas y servicio de catering. Hacé tu pedido online fácil y te lo llevamos.",
    "bannerUrl": "https://assets.olaclick.app/companies/backgrounds/df048b41-5640-4334-887e-ac3d93aa45a7.jpeg",
    "logoUrl": "https://assets.olaclick.app/companies/logos/36302785-857e-485f-840b-5ca9e02dea35.jpeg",
    "whatsappPhone": "5491134501611",
    "address": "Av. Corrientes 3420, Buenos Aires",
    "hours": "Martes a Domingo: 11:30 a 15:00 y 19:30 a 23:30",
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
      "id": "mod_guarniciones",
      "name": "Guarniciones",
      "condition": "required",
      "selectionType": "single",
      "options": [
        {
          "id": "opt_g1",
          "name": "Papas a la Portuguesa",
          "price": 0,
          "isVisible": true
        },
        {
          "id": "opt_g2",
          "name": "Puré de Papas",
          "price": 0,
          "isVisible": true
        },
        {
          "id": "opt_g3",
          "name": "Papas y Batatas al horno",
          "price": 0,
          "isVisible": true
        },
        {
          "id": "opt_g4",
          "name": "Ensalada Mixta fresca",
          "price": 0,
          "isVisible": true
        }
      ]
    },
    {
      "id": "mod_salsas_incluidas",
      "name": "Elige tus salsas incluidas",
      "condition": "required",
      "selectionType": "multiple",
      "minSelect": 1,
      "maxSelect": 2,
      "options": [
        {
          "id": "opt_s1",
          "name": "Salsa Criolla clásica",
          "price": 0,
          "isVisible": true
        },
        {
          "id": "opt_s2",
          "name": "Mayonesa casera al ajo y ciboulette",
          "price": 0,
          "isVisible": true
        },
        {
          "id": "opt_s3",
          "name": "Chimichurri suave casero",
          "price": 0,
          "isVisible": true
        },
        {
          "id": "opt_s4",
          "name": "Mostaza antigua con miel",
          "price": 0,
          "isVisible": true
        }
      ]
    },
    {
      "id": "mod_salsas_extra",
      "name": "Salsas EXTRA y Adicionales",
      "condition": "optional",
      "selectionType": "multiple",
      "maxSelect": 5,
      "options": [
        {
          "id": "opt_se1",
          "name": "Pote Salsa Criolla EXTRA",
          "price": 1500,
          "isVisible": true
        },
        {
          "id": "opt_se2",
          "name": "Pote Chimichurri ahumado EXTRA",
          "price": 1500,
          "isVisible": true
        },
        {
          "id": "opt_se3",
          "name": "Pote Barbacoa artesanal ahumada",
          "price": 1800,
          "isVisible": true
        },
        {
          "id": "opt_se4",
          "name": "Figacitas de manteca extra (x12)",
          "price": 3200,
          "isVisible": true
        }
      ]
    },
    {
      "id": "mod_coccion",
      "name": "Punto de cocción",
      "condition": "required",
      "selectionType": "single",
      "options": [
        {
          "id": "opt_c1",
          "name": "A punto (jugoso)",
          "price": 0,
          "isVisible": true
        },
        {
          "id": "opt_c2",
          "name": "Bien cocido",
          "price": 0,
          "isVisible": true
        }
      ]
    },
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
      "modifierGroupIds": [],
      "isDiscontinued": false,
      "isHidden": false,
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
      "description": "1 Bondiola a la Cerveza negra con Papas y Batatas.\n1 Pata y Muslo con Papas a la Portuguesa\n1 Canelones de ricota y espinaca con Salsa Bolognesa\n1 Ñoquis de papa con Bolognesa",
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
      "description": "Tarta individual de zapallo Cabutia con cebolla, puerro, pollo y queso. (300 gr.)",
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
      "description": "Tarta individual de Acelga con cebolla, morrón, y queso. (300 gr.)",
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
      "description": "Fetuccini artesanal de Sémola con salsa Bolognesa tradicional",
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
      "description": "1 Cavatelli de Espinaca con Crema, Pollo y Jamón\n1 Wok estilo Oriental de Fideos con Ternera y Vegetales.\n1 Fetuccini a la Bolognesa\n1 Ñoquis de Papa a la Bolognesa",
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
      "description": "1 Tarta de Acelga\n1 Tarta de Acelga y Pollo\n1 Tarta de Calabaza y Pollo\n1 Wok de Arroz Chow Fan",
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
      "description": "1 Tarta de Acelga\n1 Tarta de Acelga y Pollo\n1 Tarta de Calabaza y Pollo\n1 Tarta de Pollo",
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
      "description": "1 Bondiola de Cerdo a la Cerveza negra\n1 Pata y Muslo al horno\n1 Ternera braseada desmechada\n1 Pulled Pork desmechado",
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
      "description": "2 Wok de Arroz Chow Fan con Pollo, Huevo y Vegetales.\n2 Wok estilo Oriental de Fideos con Ternera y Vegetales.",
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
      "description": "1 Raviolones de Cerdo braseado con salsa Rosa\n1 Cavatelli de Espinaca con salsa Parisienne.\n1 Canelones (2) de Ricota y Espinaca con Bolognesa.\n1 Ternera Braseada Desmechada para Sanguchitos o para una picada ( 380 gs )",
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
      "description": "Arroz salteado con Huevo, pollo y Vegetales. (400 gr.)",
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
      "description": "Wok estilo Oriental de Fideos, Ternera y Vegetales. (400 gr.)",
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
      "description": "Tarta individual de Acelga, cebolla, morrón, pollo y queso. (300 gr.)",
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
      "description": "Tarta individual de Pollo con Zanahoria y Puerro. (300 gr.)",
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
      "description": "Tortilla de Papas individual con Cebolla rehogada",
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
      "description": "Canelones tradicionales de Ricota y Espinaca. (400 gr.)",
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
      "description": "Ñoquis de Papa con salsa Bolognesa tradicional. (400 gr.)",
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
      "description": "Bondiola a la cerveza negra en concción a baja temperatura con  cebollas, apio y zanahoria. Acompañada de papas y batatas horneadas. (400 gr.)",
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
      "description": "Raviolones de Cerdo braseado con salsa Rosa. (400 gr.)",
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
      "description": "Ñoquis de Cabutia con salsa Bolognesa tradicional. (400 gr.)",
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
      "description": "Pata y Muslo de pollo al horno con guarnición a elección. (400 gr.)",
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
      "description": "Pechuga de Pollo a la crema de Verdeo con Papas al horno. (330 gr.)",
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
      "description": "Ternera braseada a baja temperatura  y desmechada. (380 gr.)",
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
      "description": "Clásica Lengua tiernizada con Vinagreta y vegetales. (350 gr.)",
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
      "description": "Pechuga de Pollo a la crema de Verdeo con Papas al horno. (330 gr.)",
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
      "description": "Tarta individual de Acelga con cebolla, morrón, y queso. (300 gr.)",
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
      "description": "Tarta individual de zapallo Cabutia con cebolla, puerro, pollo y queso. (300 gr.)",
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
      "description": "Tarta individual de Acelga, cebolla, morrón, pollo y queso. (300 gr.)",
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
      "description": "Tarta individual de Pollo con Zanahoria y Puerro. (300 gr.)",
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
      "description": "Tortilla de Papas individual con Cebolla rehogada",
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
      "description": "Puré cremoso de Papas. (300 gr.)",
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
      "description": "Papas, morrones, cebolla, tomate natural cocidos con vino blanco, caldo y sus propios jugos.",
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
      "description": "Papas y Batatas al horno",
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
  ]
};
