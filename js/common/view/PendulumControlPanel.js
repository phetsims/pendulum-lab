// Copyright 2017-2022, University of Colorado Boulder

/**
 * Panel with length/mass controls for all available pendula
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { Line, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import pendulumLab from '../../pendulumLab.js';
import PendulumLabStrings from '../../PendulumLabStrings.js';
import PendulumLabConstants from '../PendulumLabConstants.js';
import PendulumNumberControl from './PendulumNumberControl.js';

const kilogramsPatternString = PendulumLabStrings.kilogramsPattern;
const lengthString = PendulumLabStrings.length;
const massString = PendulumLabStrings.mass;
const metersPatternString = PendulumLabStrings.metersPattern;

class PendulumControlPanel extends Panel {

  /**
   * @param {Array.<Pendulum>} pendula
   * @param {Property.<number>} numberOfPendulaProperty
   */
  constructor( pendula, numberOfPendulaProperty ) {

    const content = new VBox( {
      spacing: 16
    } );

    const separator = new Line( {
      stroke: 'rgb(160,160,160)',
      lineWidth: 0.3,
      x2: PendulumLabConstants.RIGHT_CONTENT_WIDTH
    } );

    const pendulumSliderGroups = pendula.map( pendulum => {
      const pendulumNumberString = `${pendulum.index + 1}`;
      const lengthTitle = StringUtils.fillIn( lengthString, {
        pendulumNumber: pendulumNumberString
      } );
      const massTitle = StringUtils.fillIn( massString, {
        pendulumNumber: pendulumNumberString
      } );

      //TODO #210 replace '{0}' with SunConstants.VALUE_NAMED_PLACEHOLDER
      const lengthPattern = StringUtils.fillIn( metersPatternString, { meters: '{0}' } );
      const massPattern = StringUtils.fillIn( kilogramsPatternString, { kilograms: '{0}' } );

      return new VBox( {
        spacing: 14,
        align: 'left',
        children: [
          new PendulumNumberControl( lengthTitle, pendulum.lengthProperty, pendulum.lengthRange, lengthPattern, pendulum.color ),
          new PendulumNumberControl( massTitle, pendulum.massProperty, pendulum.massRange, massPattern, pendulum.color )
        ]
      } );
    } );

    numberOfPendulaProperty.link( numberOfPendula => {
      content.children = numberOfPendula === 1 ? [
        pendulumSliderGroups[ 0 ]
      ] : [
        pendulumSliderGroups[ 0 ],
        separator,
        pendulumSliderGroups[ 1 ]
      ];
    } );

    super( content, PendulumLabConstants.PANEL_OPTIONS );
  }
}

pendulumLab.register( 'PendulumControlPanel', PendulumControlPanel );
export default PendulumControlPanel;