import {
  CrisisAlert,
  ElectricBolt,
  ElectricMeter,
  WorkHistory,
} from "@mui/icons-material";
import React from "react";

const Powpercent = ({ actpow, total }) => {
  return (
    <>
      <div className="col">
        {/*  <!-- Earnings (Monthly) Card Example --> */}
        {/*  <!-- Earnings (Monthly) Card Example --> */}
        {/*  <!-- Earnings (Monthly) Card Example --> */}
        <div>
          <div className="card border-left-danger shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Efficiency
                  </div>
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                        20%
                      </div>
                    </div>
                    <div className="col">
                      <div className="progress progress-sm mr-2">
                        <div
                          className="progress-bar bg-danger a1"
                          role="progressbar"
                          style={{ width: "20%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-auto">
                  <WorkHistory className="fas fa fa-2x text-gray-300"></WorkHistory>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card border-left-danger shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Efficiency
                  </div>
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                        20%
                      </div>
                    </div>
                    <div className="col">
                      <div className="progress progress-sm mr-2">
                        <div
                          className="progress-bar bg-danger a1"
                          role="progressbar"
                          style={{ width: "20%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-auto">
                  <WorkHistory className="fas fa fa-2x text-gray-300"></WorkHistory>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*  <!-- Pending Requests Card Example --> */}
      </div>
    </>
  );
};

export default Powpercent;
