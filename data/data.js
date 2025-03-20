//Phosphate Data
const phosphateData = [
    {
        country: "Morocco",
        code: "MA",
        receivers: [
            { country: "Brazil", code: "BR", volume: 1518664 },
            { country: "India", code: "IN", volume: 1012392 },
            { country: "Argentina", code: "AR", volume: 528589 },
            { country: "Bangladesh", code: "BD", volume: 397447 },
            { country: "United States", code: "US", volume: 396967 }
        ]
    },
    {
        country: "China",
        code: "CN",
        receivers: [
            { country: "India", code: "IN", volume: 3117818 },
            { country: "Brazil", code: "BR", volume: 717157 },
            { country: "Vietnam", code: "VN", volume: 398079 },
            { country: "Thailand", code: "TH", volume: 304225 },
            { country: "Argentina", code: "AR", volume: 242550 }
        ]
    },
    {
        country: "Saudi Arabia",
        code: "SA",
        receivers: [
            { country: "India", code: "IN", volume: 2256490 },
            { country: "Brazil", code: "BR", volume: 1408071 },
            { country: "United States", code: "US", volume: 960263 },
            { country: "Bangladesh", code: "BD", volume: 457401 },
            { country: "Australia", code: "AU", volume: 387516 }
        ]
    },
    {
        country: "Russia",
        code: "RU",
        receivers: [
            { country: "Brazil", code: "BR", volume: 2422246 },
            { country: "India", code: "IN", volume: 664334 },
            { country: "Mexico", code: "MX", volume: 434773 },
            { country: "France", code: "FR", volume: 125665 },
            { country: "Belgium", code: "BE", volume: 87424 }
        ]
    },
    {
        country: "United States",
        code: "US",
        receivers: [
            { country: "Canada", code: "CA", volume: 1190652 },
            { country: "Brazil", code: "BR", volume: 255396 },
            { country: "Mexico", code: "MX", volume: 152665 },
            { country: "Australia", code: "AU", volume: 132137 },
            { country: "Peru", code: "PE", volume: 102351 }
        ]
    }
];


//Potash Data
const potashData = [
    {
        country: "Canada",
        code: "CA",
        receivers: [
            { country: "United States", code: "US", volume: 4599815 },
            { country: "Brazil", code: "BR", volume: 3209408 },
            { country: "China", code: "CN", volume: 1416938 },
            { country: "India", code: "IN", volume: 665959 },
            { country: "Bangladesh", code: "BD", volume: 591219 }
        ]
    },
    {
        country: "Belarus",
        code: "BY",
        receivers: [
            { country: "Brazil", code: "BR", volume: 2117944 },
            { country: "China", code: "CN", volume: 2074357 },
            { country: "Indonesia", code: "ID", volume: 495162 },
            { country: "India", code: "IN", volume: 401470 },
            { country: "Vietnam", code: "VN", volume: 153393 }
        ]
    },
    {
        country: "Russia",
        code: "RU",
        receivers: [
            { country: "China", code: "CN", volume: 1815765 },
            { country: "Brazil", code: "BR", volume: 1641428 },
            { country: "United States", code: "US", volume: 584074 },
            { country: "India", code: "IN", volume: 439894 },
            { country: "Indonesia", code: "ID", volume: 268663 }
        ]
    },
    {
        country: "Germany",
        code: "DE",
        receivers: [
            { country: "Brazil", code: "BR", volume: 458389 },
            { country: "Poland", code: "PL", volume: 248920 },
            { country: "Belgium", code: "BE", volume: 189456 },
            { country: "France", code: "FR", volume: 128403 },
            { country: "China", code: "CN", volume: 90530 }
        ]
    },
    {
        country: "Israel",
        code: "IL",
        receivers: [
            { country: "Brazil", code: "BR", volume: 627838 },
            { country: "China", code: "CN", volume: 469250 },
            { country: "India", code: "IN", volume: 166098 },
            { country: "United States", code: "US", volume: 159593 },
            { country: "United Kingdom", code: "GB", volume: 98715 }
        ]
    }
];


//Urea Data
const ureaData = [
    {
        country: "Oman",
        code: "OM",
        receivers: [
            { country: "India", code: "IN", volume: 2206518 },
            { country: "Brazil", code: "BR", volume: 1609421 },
            { country: "Turkey", code: "TR", volume: 1446804 },
            { country: "South Africa", code: "ZA", volume: 201827 },
            { country: "Thailand", code: "TH", volume: 180015 }
        ]
    },
    {
        country: "Russia",
        code: "RU",
        receivers: [
            { country: "India", code: "IN", volume: 1414535 },
            { country: "Brazil", code: "BR", volume: 845901 },
            { country: "Mexico", code: "MX", volume: 379905 },
            { country: "Poland", code: "PL", volume: 345617 },
            { country: "Turkey", code: "TR", volume: 322038 }
        ]
    },
    {
        country: "Iran",
        code: "IR",
        receivers: [
            { country: "Turkey", code: "TR", volume: 2310714 },
            { country: "South Africa", code: "ZA", volume: 445527 },
            { country: "Iraq", code: "IQ", volume: 337317 },
            { country: "Sri Lanka", code: "LK", volume: 232631 },
            { country: "Vietnam", code: "VN", volume: 183892 }
        ]
    },
    {
        country: "Egypt",
        code: "EG",
        receivers: [
            { country: "Turkey", code: "TR", volume: 913984 },
            { country: "Italy", code: "IT", volume: 530868 },
            { country: "Spain", code: "ES", volume: 451970 },
            { country: "France", code: "FR", volume: 441103 },
            { country: "Argentina", code: "AR", volume: 356930 }
        ]
    },
    {
        country: "Nigeria",
        code: "NG",
        receivers: [
            { country: "Brazil", code: "BR", volume: 1289830 },
            { country: "United States", code: "US", volume: 406815 },
            { country: "Argentina", code: "AR", volume: 246977 },
            { country: "Ethiopia", code: "ET", volume: 95085 },
            { country: "Italy", code: "IT", volume: 92566 }
        ]
    }
];


const datasets = {
    phosphate: phosphateData,
    potash: potashData,
    urea: ureaData
};

let currentDataset = 'phosphate'; // Initialize currentDataset with a default dataset key

function getCurrentFertilizerData() {
    switch (currentFertilizerType) {
        case 'phosphate':
            return phosphateCropData;
        case 'potash':
            return potashCropData;
        case 'urea':
            return ureaCropData;
        default:
            console.error('Unknown fertilizer type');
            return [];
    }
}