export const polyline_store = {
    userLines: [],
    groupLines: [],
    lastColor: null,

    clearUserLines(){
        if (this.userLines.length > 0) {
            this.userLines.forEach(polyline => {
                polyline.setMap(null);
                polyline.setVisible(false); // This removes the polyline from the map permanently
                polyline = null;
            });
            this.userLines = [];
        }
    },
    addUserLine(userPolyLine){
        this.userLines = [...this.userLines, userPolyLine];
    },

    clearGroupLines(){
        if (this.groupLines.length > 0) {
            this.groupLines.forEach(polyline => {
                polyline.setMap(null);
                polyline.setVisible(false); // This removes the polyline from the map permanently
                polyline = null;
            });
            this.groupLines = [];
        }
    },
    addGroupLine(groupLine){
        this.groupLines = [...this.groupLines, groupLine];
    },

    getNewColour() {
        const colorCodes = [
            "#FF0000",  // Red --- we edit these if we want to change the options that the group polylines can be coloured to
            "#0000FF",  // Blue
            "#008000",  // Green
            "#800080",  // Purple
            "#FFA500",  // Orange 
            "#008B8B",  // Dark Cyan 
            "#006400",  // Dark Green
            "#000000",  // Black
            "#A9A9A9",  // Medium Dark Gray
            "#8B4513"   // Light-ish Brown
        ];
    
        //randomly select one color from the array
        const randomIndex = Math.floor(Math.random() * colorCodes.length);
        const newColor = colorCodes[randomIndex];
    
        //ensure it's different from the last color (if applicable)
        if (newColor === this.lastColor) {
            return this.getNewColour();  //recursively call to get a different color
        }
    
        //update the last generated color
        this.lastColor = newColor;
    
        return newColor;
    },
}