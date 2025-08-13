import '../../Styling/Dashboardstyling.css';
import ISSMap from './ISSMap';


function Dashboard() {

 
        
    

    return (
        
        <div className="dashboard-wrapper">
            <div className="dashboard-card">
                <div className="information-part">
                    <p className="label">Welcome!</p>

                </div>
                <hr className="content-divider" />
                
                <div className="grid grid-3">
                    <div className="card">
                        <h2 className="card-title">Box 1 </h2>
                        <ISSMap/>
                    </div>
                    <div className="card">
                        <h2 className="card-title">Box 2</h2>
              
                    </div>
                    <div className="card">
                        <h2 className="card-title">Box 3</h2>

                    </div>
                    
                    
                </div>


                <hr className="content-divider" />
                
                <div className="app-status-card">
                    <h3 className="card-title">Current running services:</h3>
                    <div className="grid grid-4">
                    </div>
                    </div>

                <hr className="content-divider" />


            </div>
        </div>
    );
}

export default Dashboard;
