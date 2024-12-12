export const polyline_store = {
    userLines: [],
    groupLines: [],

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
}