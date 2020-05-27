// Copyright 2014-2020, University of Colorado Boulder

/**
 * Lab screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import inherit from '../../../phet-core/js/inherit.js';
import Image from '../../../scenery/js/nodes/Image.js';
import labNavbarImage from '../../mipmaps/lab-navbar-icon_png.js';
import labScreenImage from '../../mipmaps/lab-screen-icon_png.js';
import PendulumLabConstants from '../common/PendulumLabConstants.js';
import pendulumLab from '../pendulumLab.js';
import pendulumLabStrings from '../pendulumLabStrings.js';
import LabModel from './model/LabModel.js';
import LabScreenView from './view/LabScreenView.js';

const screenLabString = pendulumLabStrings.screen.lab;

/**
 * @constructor
 */
function LabScreen() {

  const options = {
    name: screenLabString,
    backgroundColorProperty: new Property( PendulumLabConstants.BACKGROUND_COLOR ),
    homeScreenIcon: new ScreenIcon( new Image( labScreenImage ), {
      maxIconWidthProportion: 1,
      maxIconHeightProportion: 1
    } ),
    navigationBarIcon: new ScreenIcon( new Image( labNavbarImage ), {
      maxIconWidthProportion: 1,
      maxIconHeightProportion: 1
    } )
  };

  Screen.call( this,
    function() { return new LabModel(); },
    function( model ) { return new LabScreenView( model ); },
    options
  );
}

pendulumLab.register( 'LabScreen', LabScreen );

inherit( Screen, LabScreen );
export default LabScreen;