// Copyright 2014-2020, University of Colorado Boulder

/**
 * Energy screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import inherit from '../../../phet-core/js/inherit.js';
import Image from '../../../scenery/js/nodes/Image.js';
import energyImage from '../../mipmaps/energy-screen-icon_png.js';
import PendulumLabConstants from '../common/PendulumLabConstants.js';
import pendulumLab from '../pendulumLab.js';
import pendulumLabStrings from '../pendulumLabStrings.js';
import EnergyModel from './model/EnergyModel.js';
import EnergyScreenView from './view/EnergyScreenView.js';

const screenEnergyString = pendulumLabStrings.screen.energy;

/**
 * @constructor
 */
function EnergyScreen() {

  const options = {
    name: screenEnergyString,
    backgroundColorProperty: new Property( PendulumLabConstants.BACKGROUND_COLOR ),
    homeScreenIcon: new ScreenIcon( new Image( energyImage ), {
      maxIconWidthProportion: 1,
      maxIconHeightProportion: 1
    } )
  };

  Screen.call( this,
    function() { return new EnergyModel(); },
    function( model ) { return new EnergyScreenView( model ); },
    options
  );
}

pendulumLab.register( 'EnergyScreen', EnergyScreen );

inherit( Screen, EnergyScreen );
export default EnergyScreen;