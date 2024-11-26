import { h } from 'vue';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import GoogleMaps from './components/Map.vue'; 

export function VueRoot(props) {
    return (
        <div>
            <Navbar />
            <div class="main-container">
                <div class="left-section">
                    <GoogleMaps />
                </div>
                <Sidebar />
            </div>
        </div>
    );
}
