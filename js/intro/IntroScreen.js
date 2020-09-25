// Copyright 2014-2020, University of Colorado Boulder

/**
 * Intro screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Image from '../../../scenery/js/nodes/Image.js';
import introNavbarImage from '../../mipmaps/intro-navbar-icon_png.js';
import introScreenImage from '../../mipmaps/intro-screen-icon_png.js';
import PendulumLabModel from '../common/model/PendulumLabModel.js';
import PendulumLabConstants from '../common/PendulumLabConstants.js';
import PendulumLabScreenView from '../common/view/PendulumLabScreenView.js';
import pendulumLab from '../pendulumLab.js';
import pendulumLabStrings from '../pendulumLabStrings.js';

class IntroScreen extends Screen {
  constructor() {

    const options = {
      name: pendulumLabStrings.screen.intro,
      backgroundColorProperty: new Property( PendulumLabConstants.BACKGROUND_COLOR ),
      homeScreenIcon: new ScreenIcon( new Image( introScreenImage ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new Image( introNavbarImage ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } )
    };

    super(
      function() { return new PendulumLabModel(); },
      function( model ) { return new PendulumLabScreenView( model ); },
      options
    );
  }
}

pendulumLab.register( 'IntroScreen', IntroScreen );
export default IntroScreen;