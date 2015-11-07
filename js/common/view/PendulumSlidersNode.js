// Copyright 2014-2015, University of Colorado Boulder

/**
 * Node with sliders for pendulum in 'Pendulum Lab' simulation.
 * Contains length and mass sliders.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PanelPendulumAbstract = require( 'PENDULUM_LAB/common/view/PanelPendulumAbstract' );
  var PendulumOptionSliderNode = require( 'PENDULUM_LAB/common/view/PendulumOptionSliderNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var lengthString = require( 'string!PENDULUM_LAB/length' );
  var massString = require( 'string!PENDULUM_LAB/mass' );
  var pattern_0lengthValue_lengthUnitsMetric = require( 'string!PENDULUM_LAB/pattern.0lengthValue.lengthUnitsMetric' );
  var pattern_0massValue_massUnitsMetric = require( 'string!PENDULUM_LAB/pattern.0massValue.massUnitsMetric' );
  var pattern_0propertyName_1pendulumNumber = require( 'string!PENDULUM_LAB/pattern.0propertyName.1pendulumNumber' );

  // constants
  var FONT_TITLE = new PhetFont( { size: 12, weight: 'bold' } );
  var SPACING_CONTENT = 5;
  var PANEL_X_MARGIN = 14;

  /**
   * @param {PendulumLabModel} pendulumLabModel
   * @param {Object} [options] for control panel node
   * @constructor
   */
  function PendulumSlidersNode( pendulumLabModel, options ) {
    var self = this;
    var pendulumSlidersNodeStorage = [];

    this.optionSliders = [];
    var content = new VBox( { spacing: SPACING_CONTENT, align: 'center' } );
    this._content = content;

    // create sliders for each pendulum and put then into storage for further adding
    pendulumLabModel.pendulums.forEach( function( pendulum, pendulumIndex ) {
      // create length slider
      var lengthSlider = new PendulumOptionSliderNode(
        pendulum.lengthProperty,
        pendulum.lengthRange,
        pattern_0lengthValue_lengthUnitsMetric,
        pendulum.color,
        { y: SPACING_CONTENT }
      );
      self.optionSliders.push( lengthSlider );

      // create mass slider
      var massSlider = new PendulumOptionSliderNode(
        pendulum.massProperty,
        pendulum.massRange,
        pattern_0massValue_massUnitsMetric,
        pendulum.color,
        { y: SPACING_CONTENT }
      );
      self.optionSliders.push( massSlider );

      var vBoxSlidersNode = new VBox( {
        spacing: SPACING_CONTENT, align: 'left', children: [
          new Node( {
            children: [
              // add length slider label
              new Text( StringUtils.format( pattern_0propertyName_1pendulumNumber, lengthString, (pendulumIndex + 1).toString() ), {
                pickable: false,
                font: FONT_TITLE,
                fill: pendulum.color
              } ),
              // add length slider
              lengthSlider
            ]
          } ),

          new Node( {
            children: [
              // add mass slider label
              new Text( StringUtils.format( pattern_0propertyName_1pendulumNumber, massString, (pendulumIndex + 1).toString() ), {
                pickable: false,
                font: FONT_TITLE,
                fill: pendulum.color
              } ),

              // add mass slider
              massSlider
            ]
          } )
        ]
      } );
      pendulumSlidersNodeStorage.push( vBoxSlidersNode );

      lengthSlider.centerX = vBoxSlidersNode.bounds.width / 2;
      massSlider.centerX = vBoxSlidersNode.bounds.width / 2;
    } );

    // add necessary pendulum sliders
    content.addChild( pendulumSlidersNodeStorage[ 0 ] );
    pendulumLabModel.numberOfPendulumsProperty.link( function( numberOfPendulums ) {

      if ( numberOfPendulums === 1 && content.isChild( pendulumSlidersNodeStorage[ 1 ] ) ) {
        content.removeChildWithIndex( pendulumSlidersNodeStorage[ 1 ], content.indexOfChild( pendulumSlidersNodeStorage[ 1 ] ) );
      }
      else if ( numberOfPendulums === 2 && !content.isChild( pendulumSlidersNodeStorage[ 1 ] ) ) {
        content.addChild( pendulumSlidersNodeStorage[ 1 ] );
      }
    } );

    PanelPendulumAbstract.call( this, content, _.extend( { xMargin: PANEL_X_MARGIN }, options ) );
  }

  return inherit( PanelPendulumAbstract, PendulumSlidersNode, {
    setContentWidth: function( width ) {
      this._content.addChild( new HStrut( width - 2 * PANEL_X_MARGIN ) );
    }
  } );
} );