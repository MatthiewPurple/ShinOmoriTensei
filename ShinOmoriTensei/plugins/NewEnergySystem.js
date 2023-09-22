!function() {
    //Raises the energy bar's maximum to 20
    Object.defineProperty(Game_Party.prototype, 'stressEnergyCount', {get: function() {return this._stressEnergyCount;}, set: function (value) {this._stressEnergyCount = value.clamp(0, 20);}, configurable: true});

    
    //Makes sure the energy bar can be properly displayed avec 10
    let old_Sprite_StressBar_prototype_drawStressCountValue = Sprite_StressBar.prototype.drawStressCountValue;
    Sprite_StressBar.prototype.drawStressCountValue = function (value = this._ekgRow) {
        if ($gameTroop._troopId == 451) {
            //Work normally
            old_Sprite_StressBar_prototype_drawStressCountValue.call(this, value = this._ekgRow);
            return;
        }
        // Clear Text
        this._ekgText.bitmap.clear();
        // Refresh EKG Bitmap
        this._ekgText.bitmap.drawText(value.clamp(0, 20).padZero(2), 0, -4, this._ekgText.bitmap.width, this._ekgText.bitmap.height, 'center');
    };


    //Adds all the conditions of the new energy system
    let old_Game_Action_prototype_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        if ($gameTroop._troopId == 451) {
            //Work normally
            old_Game_Action_prototype_apply.call(this, target);
            return;
        }
        console.log("Nope, not BASIL...");
        // Run Original Function
        _TDS_.OmoriBattleSystem.Game_Action_apply.call(this, target);
        // Get Result
        let result = target.result();
        // Check iff hit
        let hit = result.isHit();
    
        let critical = result.critical;
    
        // If Hit
        if (hit) {
            // Get Element Rate
            let elementRate = this.calcElementRate(target);
    
            // Set elemental results
            result.elementStrong = elementRate > 1;
            result.elementWeak = elementRate < 1;
            if (result.hpDamage > 0) {
                if (!!result.critical) {
                    AudioManager.playSe({name: "BA_CRITICAL_HIT", volume: 250, pitch: 100, pan: 0});
                } else if (result.elementStrong) {
                    AudioManager.playSe({name: "se_impact_double", volume: 150, pitch: 100, pan: 0});
                } else if (result.elementWeak) {
                    AudioManager.playSe({name: "se_impact_soft", volume: 150, pitch: 100, pan: 0});
                } else {
                    SoundManager.playEnemyDamage();
                }
            }
        }
        ;
        let is_dull = result.elementWeak
        let is_moving = result.elementStrong
    
        // If Target is an enemy
        if (target.isEnemy()) {
            // Get Item
            let item = this.item();
            // If result was a hit
            if (hit) {
                // If scanning enemy
                if (item && item.meta.ScanEnemy && target.canScan()) {
                    // Scan Enemy
                    $gameParty.addScannedEnemy(target.enemyId());
                }
    
                // If HP damage is more than 0
                if (result.hpDamage > 0) {
    
                    /*
                    Moving: +3
                    Dull: -3
                    Neutral Critical: +3
                    Neutral Normal : +1
                    */
                    if (is_moving || is_dull || critical) {
                        if (is_moving) $gameParty.stressEnergyCount += 3
                        else if (is_dull) $gameParty.stressEnergyCount -= 3
                        else if (critical) $gameParty.stressEnergyCount += 3
                    } else {
                        $gameParty.stressEnergyCount += 1
                    }
                }
    
            } else {
                //If miss: -3 energy
                $gameParty.stressEnergyCount -= 3;
            }
        } else {
            // If result was a hit
            if (hit) {
    
                // If HP damage is more than 0
                if (result.hpDamage > 0) {
    
                    /*
                    Moving: -3
                    Dull: -0
                    Neutral Critical: -3
                    Neutral Normal : -1
                    */
                    if (!target.isStateAffected(2)){ //Guarding will always prevent the ENERGY from decreasing
                        if (critical || is_moving || is_dull) {
                            if (is_moving) $gameParty.stressEnergyCount -= 3
                            else if (is_dull) $gameParty.stressEnergyCount -= 0
                            else if (critical) $gameParty.stressEnergyCount -= 3
                        } else {
                            $gameParty.stressEnergyCount -= 1
                        }
                    }
                }
            }
        }
    
        // Reset energy
        if ($gameParty.stressEnergyCount < 0) $gameParty.stressEnergyCount = 0;
        if ($gameParty.stressEnergyCount > 20) $gameParty.stressEnergyCount = 20;
        if ($gameParty.inBattle()) {
            if (!BattleManager._logWindow._activeChainSkill) BattleManager._statusWindow.refreshACS();
        }
    }


    //Makes battles start with 0 ENERGY
    let old_BattleManager_startBattle = BattleManager.startBattle;
    BattleManager.startBattle = function () {
        if ($gameTroop._troopId == 451) {
            //Work normally
            old_BattleManager_startBattle.call(this);
            return;
        }
        // Run Original Function
        _TDS_.OmoriBattleSystem.BattleManager_startBattle.call(this);
        // Increase Stress Count
        $gameParty.stressEnergyCount = 0;
        // Set Default Picture Display Layer
        this.setPictureDisplayLayer('top');
    
        // Get Scene
        const scene = SceneManager._scene;
        const spriteset = scene._spriteset;
        // Set Container
        let container = spriteset._pictureContainer;
        // Move Fade Layer to Scene
        scene.addChild(spriteset._fadeSprite);
    };


    //Properly displays the RELEASE ENERGY bubble
    Window_OmoriBattleActorStatus.prototype.setupACSBubbles = function (list) {
        // Get Actor
        var actor = this.actor();
        this._lastACSList = list;
        for (var i = 0; i < this._acsBubbleSprites.length; i++) {
            // Get Skill
            var data = list[i];
            // Get Bubble
            var bubble = this._acsBubbleSprites[i];
            // Update Position
            bubble.updatePosition(i);
            // If Data
            if (data) {
                // Get Skill
                var skill = data[1];
                // Bubble Index
                var bubbleIndex = skill.meta.ChainSkillIcon === undefined ? 0 : Number(skill.meta.ChainSkillIcon);
                // If Skill is Chain Skill Energy Release And Energy is at max
                if (skill.meta.ChainSkillEnergyRelease && $gameParty.stressEnergyCount >= 20) {
                    // Change Index
                    bubbleIndex = $gameParty.size() === 1 ? 3 : 2;
                    bubble.startShake();
                } else {
                    bubble.stopShake();
                }
                ;
                // Set Bubble Index
                bubble.setBubbleIndex(bubbleIndex);
                bubble.setArrowDirection(data[0]);
                actor.canUse(skill) ? bubble.activate() : bubble.deactivate();
            }
            ;
        }
        ;
    };

    Window_OmoriBattleActorStatus.prototype.updateACSBubbleStatus = function() {
        let actor = this.actor()
        if (this._lastACSList) {
          for (const [i, bubble] of this._acsBubbleSprites.entries()) {
            let data = this._lastACSList[i]
            if (data) {
              let skill = data[1]
              actor.canUse(skill) ? bubble.activate() : bubble.deactivate()
            }
          }
        }
      }
      Window_BattleStatus.prototype.refreshACS = function() {
        for (const win of this._faceWindows) {
          win.updateACSBubbleStatus()
        }
      }
}()
