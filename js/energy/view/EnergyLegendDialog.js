// Copyright 2017-2022, University of Colorado Boulder

/**
 * Legend dialog for the energy labels
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import { AlignBox, AlignGroup, HBox, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import Dialog from '../../../../sun/js/Dialog.js';
import PendulumLabConstants from '../../common/PendulumLabConstants.js';
import pendulumLab from '../../pendulumLab.js';
import PendulumLabStrings from '../../PendulumLabStrings.js';

const energyLegendString = PendulumLabStrings.energyLegend;
const legendKineticEnergyAbbreviationString = PendulumLabStrings.legend.kineticEnergyAbbreviation;
const legendKineticEnergyString = PendulumLabStrings.legend.kineticEnergy;
const legendPotentialEnergyAbbreviationString = PendulumLabStrings.legend.potentialEnergyAbbreviation;
const legendPotentialEnergyString = PendulumLabStrings.legend.potentialEnergy;
const legendThermalEnergyAbbreviationString = PendulumLabStrings.legend.thermalEnergyAbbreviation;
const legendThermalEnergyString = PendulumLabStrings.legend.thermalEnergy;
const legendTotalEnergyAbbreviationString = PendulumLabStrings.legend.totalEnergyAbbreviation;
const legendTotalEnergyString = PendulumLabStrings.legend.totalEnergy;

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
      ].map( itemData => new HBox( {
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
      } ) )
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