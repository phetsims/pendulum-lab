// Copyright 2017-2020, University of Colorado Boulder

/**
 * Legend dialog for the energy labels
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Dialog from '../../../../sun/js/Dialog.js';
import PendulumLabConstants from '../../common/PendulumLabConstants.js';
import pendulumLab from '../../pendulumLab.js';
import pendulumLabStrings from '../../pendulumLabStrings.js';

const energyLegendString = pendulumLabStrings.energyLegend;
const legendKineticEnergyAbbreviationString = pendulumLabStrings.legend.kineticEnergyAbbreviation;
const legendKineticEnergyString = pendulumLabStrings.legend.kineticEnergy;
const legendPotentialEnergyAbbreviationString = pendulumLabStrings.legend.potentialEnergyAbbreviation;
const legendPotentialEnergyString = pendulumLabStrings.legend.potentialEnergy;
const legendThermalEnergyAbbreviationString = pendulumLabStrings.legend.thermalEnergyAbbreviation;
const legendThermalEnergyString = pendulumLabStrings.legend.thermalEnergy;
const legendTotalEnergyAbbreviationString = pendulumLabStrings.legend.totalEnergyAbbreviation;
const legendTotalEnergyString = pendulumLabStrings.legend.totalEnergy;

class EnergyLegendDialog extends Dialog {
  constructor() {
    const abbreviationGroup = new AlignGroup();
    const descriptionGroup = new AlignGroup();

    const content = new VBox( {
      spacing: 15,
      children: [
        {
          abbreviation: legendKineticEnergyAbbreviationString,
          description: legendKineticEnergyString,
          color: PendulumLabConstants.KINETIC_ENERGY_COLOR
        }, {
          abbreviation: legendPotentialEnergyAbbreviationString,
          description: legendPotentialEnergyString,
          color: PendulumLabConstants.POTENTIAL_ENERGY_COLOR
        }, {
          abbreviation: legendThermalEnergyAbbreviationString,
          description: legendThermalEnergyString,
          color: PendulumLabConstants.THERMAL_ENERGY_COLOR
        }, {
          abbreviation: legendTotalEnergyAbbreviationString,
          description: legendTotalEnergyString,
          color: PendulumLabConstants.TOTAL_ENERGY_COLOR
        }
      ].map( function( itemData ) {
        return new HBox( {
          spacing: 20,
          children: [
            new AlignBox( new RichText( itemData.abbreviation, {
              font: PendulumLabConstants.LEGEND_ABBREVIATION_FONT,
              fill: itemData.color,
              maxWidth: 100
            } ), {
              group: abbreviationGroup,
              xAlign: 'left'
            } ),
            new AlignBox( new Text( itemData.description, {
              font: PendulumLabConstants.LEGEND_DESCRIPTION_FONT
            } ), {
              group: descriptionGroup,
              xAlign: 'left',
              maxWidth: 500
            } )
          ]
        } );
      } )
    } );

    super( content, {
      ySpacing: 20,
      title: new Text( energyLegendString, {
        font: PendulumLabConstants.DIALOG_TITLE_FONT,
        maxWidth: 700
      } )
    } );
  }
}

pendulumLab.register( 'EnergyLegendDialog', EnergyLegendDialog );
export default EnergyLegendDialog;