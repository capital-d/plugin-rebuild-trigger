import React from 'react';
import { useConfig } from 'payload/components/utilities'

const baseClass = 'after-dashboard';

const AfterDashboard: React.FC = () => {

  const config = useConfig()

  const {
    routes: {
      admin: adminRoute, // already includes leading slash
    } = {},
    serverURL,
  } = config

  console.log(config)

  return (
    <div className={baseClass}>
      <h4>This component was added by the plugin</h4>
      <h5>
        Find it here: <code>src/components/afterDashboard</code>
      </h5>

    </div>
  )
};

export default AfterDashboard;
