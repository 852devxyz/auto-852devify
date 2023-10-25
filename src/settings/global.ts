export const settings= {
    "modelsFolder": "/models",
    
    "default": {
        "enlarge": 1.2,
        "mask": {widthAdjust: 1.18, uriL: './red160px.png', uriR: './redr160px.png', comment: "Width Adjust: noggles width(160), noggles holder(30),due expand 1/5 for better output"},
        "confidence": 0.3,
        "flip": true,
        "showMask":true,
        "showLM":false,
        "hideDemoButton": true,
    },
   
}

export enum maskTypes {"byFaceEyesWidth","byEyesMiddle", "byFaceWidth", "fullFace"}