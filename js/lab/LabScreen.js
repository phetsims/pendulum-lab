// Copyright 2014-2021, University of Colorado Boulder

/**
 * Lab screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import labNavbarImage from '../../mipmaps/lab-navbar-icon_png.js';
import labScreenImage from '../../mipmaps/lab-screen-icon_png.js';
import PendulumLabConstants from '../common/PendulumLabConstants.js';
import pendulumLab from '../pendulumLab.js';
import pendulumLabStrings from '../pendulumLabStrings.js';
import LabModel from './model/LabModel.js';
import LabScreenView from './view/LabScreenView.js';

class LabScreen extends Screen {
  constructor() {

    const options = {
      name: pendulumLabStrings.screen.lab,
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

    super(
      () => new LabModel(),
      model => new LabScreenView( model ),
      options
    );
  }
}

pendulumLab.register( 'LabScreen', LabScreen );
export default LabScreen;