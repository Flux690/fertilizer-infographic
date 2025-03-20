const phosphateCropData = [
    {
        country: "India",
        code: "IN",
        totalImportVolume: 7051034,
        products: [
            { crop: "Rice", percentage: 26 },
            { crop: "Wheat", percentage: 20 },
            { crop: "Pulses", percentage: 9 },
            { crop: "SugarCrops", percentage: 5 },
            { crop: "Corn", percentage: 4 },
            { crop: "Others", percentage: 36 }
        ]
    },
    {
        country: "Brazil",
        code: "BR",
        totalImportVolume: 6321535,
        products: [
            { crop: "Soybeans", percentage: 39 },
            { crop: "Corn", percentage: 33 },
            { crop: "SugarCrops", percentage: 9 },
            { crop: "Rice", percentage: 2 },
            { crop: "Wheat", percentage: 1 },
            { crop: "Others", percentage: 16 }
        ]
    },
    {
        country: "United States",
        code: "US",
        totalImportVolume: 1357230,
        products: [
            { crop: "Corn", percentage: 50 },
            { crop: "Soybeans", percentage: 30 },
            { crop: "Wheat", percentage: 9 },
            { crop: "Sorghum", percentage: 1 },
            { crop: "Rice", percentage: 1 },
            { crop: "Others", percentage: 9 }
        ]
    },
    {
        country: "Canada",
        code: "CA",
        totalImportVolume: 1190652,
        products: [
            { crop: "Rapeseed", percentage: 35 },
            { crop: "Wheat", percentage: 28 },
            { crop: "Corn", percentage: 9 },
            { crop: "Soybeans", percentage: 8 },
            { crop: "Barley", percentage: 8 },
            { crop: "Others", percentage: 12 }
        ]
    },
    {
        country: "Bangladesh",
        code: "BD",
        totalImportVolume: 854848,
        products: [
            { crop: "Rice", percentage: 72 },
            { crop: "Corn", percentage: 5 },
            { crop: "FibreCrops", percentage: 4 },
            { crop: "Wheat", percentage: 2 },
            { crop: "Pulses", percentage: 2 },
            { crop: "Others", percentage: 15 }
        ]
    }
];

const potashCropData = [
    {
        country: "India",
        code: "IN",
        totalImportVolume: 1673421,
        products: [
            { crop: "Rice", percentage: 9 },
            { crop: "Wheat", percentage: 7 },
            { crop: "Pulses", percentage: 4 },
            { crop: "SugarCrops", percentage: 10 },
            { crop: "Soybeans", percentage: 3 },
            { crop: "Others", percentage: 67 }
        ]
    },
    {
        country: "Brazil",
        code: "BR",
        totalImportVolume: 8055007,
        products: [
            { crop: "Soybeans", percentage: 37 },
            { crop: "Corn", percentage: 13 },
            { crop: "SugarCrops", percentage: 15 },
            { crop: "Rice", percentage: 1 },
            { crop: "Wheat", percentage: 1 },
            { crop: "Others", percentage: 33 }
        ]
    },
    {
        country: "United States",
        code: "US",
        totalImportVolume: 5343482,
        products: [
            { crop: "Corn", percentage: 31 },
            { crop: "Soybeans", percentage: 43 },
            { crop: "Wheat", percentage: 5 },
            { crop: "Sorghum", percentage: 1 },
            { crop: "SugarCorps", percentage: 3 },
            { crop: "Others", percentage: 17 }
        ]
    },
    {
        country: "China",
        code: "CN",
        totalImportVolume: 3792483,
        products: [
            { crop: "Rice", percentage: 5 },
            { crop: "Wheat", percentage: 5 },
            { crop: "Corn", percentage: 8 },
            { crop: "Pulses", percentage: 3 },
            { crop: "Soybeans", percentage: 3 },
            { crop: "Others", percentage: 76 }
        ]
    },
    {
        country: "Indonesia",
        code: "ID",
        totalImportVolume: 763825,
        products: [
            { crop: "Rice", percentage: 5 },
            { crop: "Corn", percentage: 1 },
            { crop: "OilPalm", percentage: 36 },
            { crop: "SugarCorps", percentage: 2 },
            { crop: "Pulses", percentage: 0 },
            { crop: "Others", percentage: 56 }
        ]
    }
];

const ureaCropData = [
    {
        country: "India",
        code: "IN",
        totalImportVolume: 3621053,
        products: [
            { crop: "Rice", percentage: 21 },
            { crop: "Wheat", percentage: 20 },
            { crop: "Pulses", percentage: 9 },
            { crop: "SugarCrops", percentage: 3 },
            { crop: "Soybeans", percentage: 5 },
            { crop: "Others", percentage: 42 }
        ]
    },
    {
        country: "Brazil",
        code: "BR",
        totalImportVolume: 3745152,
        products: [
            { crop: "Soybeans", percentage: 59 },
            { crop: "Corn", percentage: 20 },
            { crop: "SugarCrops", percentage: 5 },
            { crop: "Rice", percentage: 1 },
            { crop: "Wheat", percentage: 1 },
            { crop: "Others", percentage: 14 }
        ]
    },
    {
        country: "Turkey",
        code: "TR",
        totalImportVolume: 4993540,
        products: [
            { crop: "Barley", percentage: 12 },
            { crop: "Corn", percentage: 6 },
            { crop: "Wheat", percentage: 30 },
            { crop: "Pulses", percentage: 6 },
            { crop: "Sunflowers", percentage: 4 },
            { crop: "Others", percentage: 42 }
        ]
    },
    {
        country: "Thailand",
        code: "TH",
        totalImportVolume: 180015,
        products: [
            { crop: "Rice", percentage: 33 },
            { crop: "SugarCorps", percentage: 7 },
            { crop: "OilPalm", percentage: 5 },
            { crop: "Corn", percentage: 5 },
            { crop: "Pulses", percentage: 2 },
            { crop: "Others", percentage: 48 }
        ]
    },
    {
        country: "Mexico",
        code: "MX",
        totalImportVolume: 379905,
        products: [
            { crop: "Sorghum", percentage: 6 },
            { crop: "Corn", percentage: 32 },
            { crop: "SugarCrops", percentage: 5 },
            { crop: "Wheat", percentage: 7 },
            { crop: "Pulses", percentage: 2 },
            { crop: "Others", percentage: 48 }
        ]
    }
];