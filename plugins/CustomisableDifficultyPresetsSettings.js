(function () {
  oldCreate = Scene_OmoriTitleScreen.prototype.create;
  Scene_OmoriTitleScreen.prototype.create = function () {
      
      if ($modLoader.knownMods.has('modconfigs')) {
        Snek.ModConfigs.addConfig({
          header: 'Presets',
          options: ['EASY', 'NORMAL', 'HARD', 'INSANE', 'MERCILESS'],
          helpText: 'Overall game difficulty'
        })

        Snek.ModConfigs.addConfig({
          header: 'Multipliers restriction',
          options: ['HS', 'FA', 'Both'],
          helpText: 'Restrict difficulty presets to HEADSPACE or FARAWAY battles'
        })

        Snek.ModConfigs.addConfig({
          header: 'Number of skills',
          options: ['4', '6', '8', '10', '12', '14'],
          helpText: 'How many skills you can have equipped at once'
        })

        Snek.ModConfigs.addConfig({
          header: 'After a Game Over',
          options: ['Retry', 'Title', 'Permadeath'],
          helpText: 'The option to restart a fight after a Game Over'
        })

        Snek.ModConfigs.addConfig({
          header: 'Stale moves',
          options: ['ENABLE', 'DISABLE'],
          helpText: 'Skills get weaker upon repeated usage'
        })

        Snek.ModConfigs.addConfig({
          header: 'Scary critical hits',
          options: ['ENABLE', 'DISABLE'],
          helpText: 'Critical hits may inflict AFRAID on an ally'
        })
      }

      oldCreate.call(this);
  };
})();
