const formulaire = $('form');
const formulaire_titre = $('form h1');
const champ_recherche = $('.form-control');
const affichage_resultat = $(".results");
const detail_titre = $(".detailContainer h3");
const detail_corps = $(".detailContainer p");
const resultat_haut = $(".resultsContainer h2");
const resultat_haut_droite = $(".detailContainer h2");
const bouton_envoie = $(".btn-primary");
const first_container = $(".container");

//quand la page est prête, finie de chargée
ready_document = function() {
  //on vide le champ de recherche au (re)chargement de la page 
  champ_recherche.val('');
  ecoute_submit();
  return 0;
};

//quand on soumet (submit) le formulaire
ecoute_submit = function() {
  return formulaire.on('submit', function(e) {
    //on empèche le rechargement de la page
    e.preventDefault();
    //on stope l'alerte champ vide
    finich_alert_champ_vide();
    resultat_haut.html('Résultats').css('color', '#000000');
    resultat_haut_droite.html('Détail');
    //si le champ recherche contient quelquechose (not false)
    if (champ_recherche.val()) {
      //on vide l'affichage des résultats
      vider_affichage_resultats();
      //on affiche loader
      accio_loading();
      return $.getJSON('proxy.php', {
        search: champ_recherche.val()}, 
        //quand on recoit un json
        function(json) {
        // on enlève le loader  
        avadakedavra_loading();
        //on affiche le resultat et on sort de la fonction
        return afficher_resultats(json);
      });
    } 
    else {
      vider_affichage_resultats();
      return alert_champ_vide();
    }
  });
};

// tester le retour json et afficher les résultats à gauche
afficher_resultats = function(json) {
  let i, item, taille, recherche_resultats;
  recherche_resultats = json.query.search;
  //test si json non vide
  if (recherche_resultats && recherche_resultats.length !== 0) {
    //affiche tous les résultats
    for (i = 0, taille = recherche_resultats.length; i < taille; i++) {
      item = recherche_resultats[i];
      affichage_resultat.append('<li class="list-group-item clearfix"> <a class="result_item" href="#" data-title="' + item.title + '"> <h3 class="list-group-item-heading">' + item.title + '</h3> <p class="list-group-item-text">' + item.snippet + '</p> </a> </li>');
    }
    //sort de la fonction et attend l'affichage du détail
    au_passage();
    return chercher_detail_resultat();
  } 
  else {
    //sinon si json vide, vide les anciens résultats et affiche une erreur
    vider_affichage_resultats();
    resultat_haut.html('Pas de résultats').css('color', '#cccccc');
    resultat_haut_droite.html('&nbsp;');
    return resultat_haut.effect( "shake", { times : 2 }, 400);
  }
};

au_passage = function(){
  $('.result_item').mouseenter(function() {
    $(this).parent().addClass('active');
 });
  return $('.result_item').mouseleave(function() {
     $(this).parent().removeClass('active');  
 });
}; 

//requete pour avoir une data json en particulier au click sur un résultat
chercher_detail_resultat = function() {
  //au clique sur un item
  return $('.result_item').click(function() {
    accio_loading();
    return $.getJSON('proxy.php', {
      title: $(this).data('title')
    }, function(json) {
      avadakedavra_loading();
      //retourne le détail
      return afficher_detail_resultat(json);
    });
  });
};

//afficher le détail d'un résultat 
afficher_detail_resultat = function(json) {
  let item_infos;
  //on parse pour convertir en objet javascript
  item_infos = json.parse;
  //on affiche le titre...
  detail_titre.html(item_infos.title);
  //...et le corps du détail du résultat
  return detail_corps.html(item_infos.text["*"]);
};


//afficher l'alerte du champ vide
alert_champ_vide = function() {
  $('form').append('<div id="warning"><strong>Attention, </strong>veuillez remplir le champ "<strong>Mots-clés</strong>"</div>');
  champ_recherche.css('border-color', '#ff0000');
  return $('#warning').effect( "shake", { times : 2 }, 400);
  
};

//enlever l'alerte du champ vide
finich_alert_champ_vide = function() {
  champ_recherche.css('border-color', '#cccccc');
  return $('#warning').remove();
};

vider_affichage_resultats = function() {
  detail_titre.empty(); 
  detail_corps.empty();
  return affichage_resultat.empty();
};

// faire apparaitre le loader et le texte du bouton
accio_loading = function() {
  bouton_envoie.button('loading');
  bouton_envoie.css('min-width', '148px');
  return first_container.append('<a id="loading">&nbsp;<img src="load.svg" width="3%" height="3%"></img></a>');
};

// enlever les loader
avadakedavra_loading = function() {
  bouton_envoie.button("reset")
  formulaire_titre.css('color', '#000000');
  return $('#loading').remove();
};


jQuery(document).ready(ready_document);
