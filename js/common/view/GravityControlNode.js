// Copyright 2014-2019, University of Colorado Boulder

/**
 * Gravity slider and body list node in 'Pendulum lab' simulation.
 * Tweakers can be added using special function.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( require => {
  'use strict';

  // modules
  const Body = require( 'PENDULUM_LAB/common/model/Body' );
  const ComboBox = require( 'SUN/ComboBox' );
  const ComboBoxItem = require( 'SUN/ComboBoxItem' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  const PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  const PendulumNumberControl = require( 'PENDULUM_LAB/common/view/PendulumNumberControl' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const gravitationalAccelerationPatternString = require( 'string!PENDULUM_LAB/gravitationalAccelerationPattern' );
  const gravityString = require( 'string!PENDULUM_LAB/gravity' );
  const lotsString = require( 'string!PENDULUM_LAB/lots' );
  const noneString = require( 'string!PENDULUM_LAB/none' );
  const whatIsTheValueOfGravityString = require( 'string!PENDULUM_LAB/whatIsTheValueOfGravity' );

  /**
   * @constructor
   *
   * @param {Property.<number>} gravityProperty - Property to update by slider.
   * @param {Range} gravityRange - Range of gravity property.
   * @param {Property.<Body>} bodyProperty - Property to update by combo box.
   * @param {Node} popupLayer
   * @param {Object} [options]
   */
  function GravityControlNode( gravityProperty, gravityRange, bodyProperty, popupLayer, options ) {
    options = merge( {
      useTextSliderLabels: true
    }, options );

    //TODO #210 replace '{0}' with SunConstants.VALUE_NAMED_PLACEHOLDER
    const labelPattern = StringUtils.fillIn( gravitationalAccelerationPatternString, {
      gravity: '{0}'
    } );

    const comboBoxItems = Body.BODIES.map( function( body ) {
      return new ComboBoxItem( new Text( body.title, {
          font: PendulumLabConstants.GRAVITY_COMBO_FONT,
          maxWidth: 50
        } ), body );
    } );

    const comboBox = new ComboBox( comboBoxItems, bodyProperty, popupLayer, {
      cornerRadius: 3,
      xMargin: 13,
      yMargin: 5
    } );

    const questionText = new Text( whatIsTheValueOfGravityString, { font: PendulumLabConstants.VALUE_OF_GRAVITY_FONT } );

    bodyProperty.link( function( body ) {
      questionText.visible = body === Body.PLANET_X;
    } );

    const numberControl = new PendulumNumberControl( gravityString, gravityProperty, gravityRange, labelPattern, 'rgb(50,145,184)', {
      hasReadoutProperty: new DerivedProperty( [ bodyProperty ], function( body ) {
        return !options.useTextSliderLabels && body !== Body.PLANET_X;
      } ),
      minTick: options.useTextSliderLabels ? noneString : null,
      maxTick: options.useTextSliderLabels ? lotsString : null,
      createBottomContent: function( bottomBox ) {

        // Supports Pendulum Lab's questionText where a question is substituted for the slider
        const bottomContent = new Node( {
          children: [
            bottomBox,
            questionText
          ]
        } );
        questionText.maxWidth = bottomBox.width;
        questionText.center = bottomBox.center;
        questionText.onStatic( 'visibility', function() {
          bottomBox.visible = !questionText.visible;
        } );

        return bottomContent;
      },
      excludeTweakers: options.useTextSliderLabels,
      sliderPadding: options.useTextSliderLabels ? 14 : 0,

      // subcomponent options
      sliderOptions: {
        thumbFill: '#00C4DF',
        thumbFillHighlighted: '#71EDFF',
        // See https://github.com/phetsims/pendulum-lab/issues/183 for rounding
        constrainValue: function( value ) {
          return Util.roundSymmetric( value * 2 ) / 2;
        }
      }
    } );

    VBox.call( this, merge( {
      spacing: 5,
      children: [ numberControl, comboBox ]
    }, options ) );
  }

  pendulumLab.register( 'GravityControlNode', GravityControlNode );

  return inherit( VBox, GravityControlNode );
} );
