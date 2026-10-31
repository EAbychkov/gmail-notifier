# Store listing in other languages

Paste each block into the Developer Dashboard: Store listing → the language dropdown at the top → pick the language → Description.

The **summary** of a listing comes from the manifest's `description`, which is `"__MSG_appDescription__"`: the dashboard takes each language's `appDescription` from `extension/_locales/<lang>/messages.json` (each fits the 132-character limit), so it changes with the package, not here. The summaries below are copies of those for reference. Português do Brasil has no locale in the extension, so the dashboard shows the English summary there; the one below is ready for a `pt_BR` locale.

The note on the services' interfaces, the privacy part and the open-source line are the same in meaning as the English listing (`store/listing.md`); product and service names, the licence name and the URL stay as they are, except that the Russian text calls Yandex Mail by its Russian name, Яндекс Почта. "Settings → Other mail" uses the names the extension's settings page shows in that language.

## Русский (ru)

**Summary:** Непрочитанная почта Gmail, Yahoo, AOL, Proton, Яндекса и Mail.ru в быстрой панели. Читайте, архивируйте, удаляйте без новых вкладок.

```
Mail Deck собирает непрочитанные письма Gmail, Yahoo Mail, AOL Mail, Proton Mail, Яндекс Почты и Mail.ru в одну панель на панели инструментов, из аккаунтов, в которые вы вошли в этом браузере.

Расширение работает через сеанс, который уже есть в браузере, так же как веб-страница самого сервиса. Без пароля, без пароля приложения, без OAuth и без наших серверов. Gmail работает сразу. Для остальных войдите на сайт сервиса как обычно и включите его в разделе «Настройки» → «Другая почта»; Chrome попросит разрешить доступ к сайтам этого сервиса, а при выключении разрешение снимается.

Нажмите на письмо, чтобы прочитать его прямо в панели. Письмо можно отметить прочитанным, отправить в архив, удалить или пометить как спам, не открывая вкладку. Нажмите на ящик, чтобы открыть его на сайте сервиса.

Возможности
- Все ящики, в которые вы вошли, у каждого свой цвет, в том порядке, в какой вы их перетащите
- Gmail: до десяти аккаунтов, переписка целиком вместе с вложениями, поиск по всем аккаунтам, звёздочки, выбранные ярлыки или только вкладка «Несортированные» и Google Meet в один клик
- Yahoo Mail, AOL Mail, Яндекс Почта и Mail.ru: письма читаются прямо в панели
- Proton Mail: отправитель, тема и время в панели; само письмо открывается на сайте Proton, потому что оно защищено сквозным шифрованием
- «Напомнить позже»: уберите письмо до вечера, до завтра или до следующей недели
- Прочитать, архивировать, удалить или пометить как спам из панели или уведомления, с отменой (у Яндекс Почты и Mail.ru нет архива)
- Уведомления и звук по желанию, с тихими часами, тихими ящиками и правилами для отправителей
- Боковая панель, горячая клавиша и одна клавиша на каждое действие
- Светлая и тёмная тема, как в системе
- Резервная копия настроек в файл или в синхронизацию Chrome
- Бесплатно, без ограничений на число аккаунтов и без платных тарифов

У Yahoo Mail, AOL Mail, Proton Mail, Яндекс Почты и Mail.ru нет для этого публичного интерфейса, поэтому Mail Deck обращается к ним так же, как их собственные веб-приложения, и изменение на их стороне может остановить сервис, пока Mail Deck не обновится.

Конфиденциальность
У Mail Deck нет своих серверов и аналитики. Расширение обращается только к Google и к почтовым сервисам, которые вы включили, через сеансы, которые уже есть в браузере, и почта каждого сервиса уходит только в этот сервис. Оно никогда не спрашивает и не хранит ваш пароль, а настройки остаются в браузере.

Mail Deck — проект с открытым кодом под лицензией Mozilla Public License 1.1: https://github.com/EAbychkov/mail-deck
Расширение не создано Google, Yahoo, AOL, Proton, Яндексом или VK и не связано с ними. Gmail — товарный знак Google LLC; остальные названия принадлежат их владельцам.
```

## Українська (uk)

**Summary:** Непрочитана пошта з Gmail, Yahoo, AOL, Proton, Yandex і Mail.ru у швидкій панелі. Читайте, архівуйте й видаляйте без нових вкладок.

```
Mail Deck збирає непрочитані листи Gmail, Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail і Mail.ru в одну панель на панелі інструментів, з акаунтів, у які ви ввійшли в цьому браузері.

Розширення працює через сеанс, який уже є у браузері, так само як вебсторінка самого сервісу. Без пароля, без пароля застосунку, без OAuth і без наших серверів. Gmail працює одразу. Для решти ввійдіть на сайт сервісу як зазвичай і ввімкніть його в розділі «Налаштування» → «Інша пошта»; Chrome попросить дозволити доступ до сайтів цього сервісу, а коли ви його вимкнете, дозвіл буде знято.

Натисніть на лист, щоб прочитати його просто в панелі. Лист можна позначити прочитаним, архівувати, видалити або позначити як спам, не відкриваючи вкладку. Натисніть на скриньку, щоб відкрити її на сайті сервісу.

Можливості
- Усі скриньки, у які ви ввійшли, кожна зі своїм кольором, у тому порядку, у який ви їх перетягнете
- Gmail: до десяти акаунтів, усе листування разом із вкладеннями, пошук в усіх акаунтах, зірочки, вибрані мітки або лише вкладка «Основні» та Google Meet в один клік
- Yahoo Mail, AOL Mail, Yandex Mail і Mail.ru: листи читаються просто в панелі
- Proton Mail: відправник, тема й час у панелі; сам лист відкривається на сайті Proton, бо він захищений наскрізним шифруванням
- «Нагадати пізніше»: відкладіть лист до вечора, до завтра або до наступного тижня
- Прочитати, архівувати, видалити або позначити як спам з панелі чи сповіщення, зі скасуванням (у Yandex Mail і Mail.ru немає архіву)
- Сповіщення і звук за бажанням, з тихими годинами, тихими скриньками та правилами для відправників
- Бічна панель, гаряча клавіша й одна клавіша на кожну дію
- Світла й темна тема, як у системі
- Резервна копія налаштувань у файл або в синхронізацію Chrome
- Безкоштовно, без обмежень на кількість акаунтів і без платних тарифів

Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail і Mail.ru не мають для цього публічного інтерфейсу, тож Mail Deck звертається до них так само, як їхні власні вебзастосунки, і зміна з їхнього боку може зупинити сервіс, доки Mail Deck не оновиться.

Конфіденційність
У Mail Deck немає власних серверів і аналітики. Розширення звертається лише до Google і до поштових сервісів, які ви ввімкнули, через сеанси, які вже є у браузері, і пошта кожного сервісу йде лише до нього. Воно ніколи не запитує і не зберігає ваш пароль, а налаштування залишаються у браузері.

Mail Deck — проєкт із відкритим кодом за ліцензією Mozilla Public License 1.1: https://github.com/EAbychkov/mail-deck
Розширення не створене Google, Yahoo, AOL, Proton, Yandex чи VK і не пов'язане з ними. Gmail — торговельна марка Google LLC; інші назви належать їхнім власникам.
```

## Deutsch (de)

**Summary:** Ungelesene Mails von Gmail, Yahoo, AOL, Proton, Yandex und Mail.ru im schnellen Panel. Lesen, archivieren, löschen ohne neuen Tab.

```
Mail Deck holt die ungelesenen Mails von Gmail, Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail und Mail.ru in ein Fenster in der Symbolleiste, aus den Konten, in denen du in diesem Browser angemeldet bist.

Es nutzt die Sitzung, die dein Browser schon hat, so wie die Webseite des Dienstes selbst. Kein Passwort, kein App-Passwort, kein OAuth, keine Server von uns. Gmail funktioniert sofort. Für die anderen meldest du dich wie gewohnt auf der Seite des Dienstes an und schaltest ihn unter Einstellungen → Weitere E-Mail-Dienste ein; Chrome fragt dann, ob du die Seiten dieses Dienstes erlaubst, und beim Ausschalten wird die Berechtigung wieder entzogen.

Klicke auf eine Mail, um sie direkt im Fenster zu lesen. Du kannst sie als gelesen markieren, archivieren, löschen oder als Spam melden, ohne einen Tab zu öffnen. Ein Klick auf ein Postfach öffnet es auf der Seite des Dienstes.

Funktionen
- Alle angemeldeten Postfächer, jedes in eigener Farbe und in der Reihenfolge, in die du sie ziehst
- Gmail: bis zu zehn Konten, ganze Unterhaltungen mit Anhängen, Suche in allen Konten, Sterne, ausgewählte Labels oder nur der Tab „Allgemein“ und Google Meet mit einem Klick
- Yahoo Mail, AOL Mail, Yandex Mail und Mail.ru: Mails direkt im Fenster lesen
- Proton Mail: Absender, Betreff und Uhrzeit im Fenster; die Mail selbst öffnet sich auf der Seite von Proton, weil sie Ende-zu-Ende-verschlüsselt ist
- Später erinnern: eine Mail bis heute Abend, morgen oder nächste Woche beiseitelegen
- Lesen, archivieren, löschen oder als Spam melden im Fenster oder in einer Benachrichtigung, mit Rückgängig (Yandex Mail und Mail.ru ohne Archiv)
- Benachrichtigungen und ein optionaler Ton, mit Ruhezeiten, stummen Postfächern und Regeln für Absender
- Seitenleiste, ein Tastenkürzel und eine Taste pro Aktion
- Helles und dunkles Design, passend zum System
- Sicherung der Einstellungen als Datei oder in der Chrome-Synchronisierung
- Kostenlos, ohne Kontolimit und ohne Bezahlversion

Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail und Mail.ru haben dafür keine öffentliche Schnittstelle. Mail Deck folgt deshalb ihren eigenen Web-Apps, und eine Änderung auf ihrer Seite kann einen Dienst stoppen, bis Mail Deck aktualisiert ist.

Datenschutz
Mail Deck hat keine eigenen Server und keine Analyse. Es spricht nur mit Google und mit den E-Mail-Diensten, die du einschaltest, jeweils über die Sitzung, die dein Browser schon hat, und die Mails jedes Dienstes gehen nur an diesen Dienst. Es fragt nie nach deinem Passwort und speichert es nicht, und deine Einstellungen bleiben in deinem Browser.

Mail Deck ist Open Source unter der Mozilla Public License 1.1: https://github.com/EAbychkov/mail-deck
Es stammt nicht von Google, Yahoo, AOL, Proton, Yandex oder VK und ist mit keinem dieser Unternehmen verbunden. Gmail ist eine Marke von Google LLC; die anderen Namen gehören ihren Inhabern.
```

## Español (es)

**Summary:** Correo sin leer de Gmail, Yahoo, AOL, Proton, Yandex y Mail.ru en un panel rápido. Léelo, archívalo o elimínalo sin abrir pestañas.

```
Mail Deck reúne en un panel de la barra de herramientas el correo sin leer de Gmail, Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail y Mail.ru, de las cuentas en las que has iniciado sesión en este navegador.

Funciona con la sesión que tu navegador ya tiene, igual que la propia página web de cada servicio. Sin contraseña, sin contraseña de aplicación, sin OAuth y sin servidores nuestros. Gmail funciona desde el primer momento. Para los demás, inicia sesión en el sitio del servicio como siempre y actívalo en Configuración → Otro correo; Chrome te pedirá que permitas los sitios de ese servicio, y al desactivarlo se retira el permiso.

Haz clic en un mensaje para leerlo en el propio panel. Puedes marcarlo como leído, archivarlo, eliminarlo o denunciarlo como spam sin abrir ninguna pestaña. Haz clic en un buzón para abrirlo en el sitio del servicio.

Funciones
- Todos los buzones con sesión iniciada, cada uno con su color y en el orden en que los arrastres
- Gmail: hasta diez cuentas, conversaciones completas con los archivos adjuntos, búsqueda en todas las cuentas, destacados, las etiquetas que elijas o solo la pestaña Principal, y Google Meet con un clic
- Yahoo Mail, AOL Mail, Yandex Mail y Mail.ru: lee los mensajes en el panel
- Proton Mail: remitente, asunto y hora en el panel; el mensaje se abre en el sitio de Proton, porque está cifrado de extremo a extremo
- Recordar más tarde: aparta un mensaje hasta esta tarde, mañana o la semana que viene
- Leer, archivar, eliminar o denunciar spam desde el panel o una notificación, con opción de deshacer (Yandex Mail y Mail.ru no tienen archivo)
- Notificaciones y un sonido opcional, con horas de silencio, buzones silenciados y reglas por remitente
- Panel lateral, un atajo de teclado y una tecla para cada acción
- Tema claro y oscuro, según tu sistema
- Copia de seguridad de los ajustes en un archivo o en la sincronización de Chrome
- Gratis, sin límite de cuentas y sin versión de pago

Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail y Mail.ru no tienen una interfaz pública para esto, así que Mail Deck sigue sus propias aplicaciones web, y un cambio por su parte puede detener alguno de ellos hasta que Mail Deck se actualice.

Privacidad
Mail Deck no tiene servidores propios ni analítica. Solo se comunica con Google y con los servicios de correo que actives, cada uno con la sesión que tu navegador ya tiene, y el correo de cada servicio solo va a ese servicio. Nunca pide ni guarda tu contraseña, y tus ajustes se quedan en tu navegador.

Mail Deck es de código abierto con la licencia Mozilla Public License 1.1: https://github.com/EAbychkov/mail-deck
No está hecho por Google, Yahoo, AOL, Proton, Yandex ni VK, ni está afiliado a ellos. Gmail es una marca comercial de Google LLC; los demás nombres pertenecen a sus propietarios.
```

## Français (fr)

**Summary:** Les non-lus de Gmail, Yahoo, AOL, Proton, Yandex et Mail.ru dans un panneau rapide. Lisez, archivez ou supprimez sans nouvel onglet.

```
Mail Deck rassemble dans un panneau de la barre d'outils les e-mails non lus de Gmail, Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail et Mail.ru, pour les comptes auxquels vous êtes connecté dans ce navigateur.

Il passe par la session que votre navigateur a déjà, comme la page web du service elle-même. Pas de mot de passe, pas de mot de passe d'application, pas d'OAuth, pas de serveurs à nous. Gmail fonctionne tout de suite. Pour les autres, connectez-vous au site du service comme d'habitude, puis activez-le dans Paramètres → Autres messageries ; Chrome vous demande alors d'autoriser les sites de ce service, et le désactiver retire l'autorisation.

Cliquez sur un message pour le lire directement dans le panneau. Vous pouvez le marquer comme lu, l'archiver, le supprimer ou le signaler comme spam sans ouvrir d'onglet. Cliquez sur une boîte de réception pour l'ouvrir sur le site du service.

Fonctionnalités
- Toutes les boîtes connectées, chacune avec sa couleur et dans l'ordre où vous les faites glisser
- Gmail : jusqu'à dix comptes, conversations entières avec pièces jointes, recherche dans tous les comptes, messages suivis, libellés choisis ou seulement l'onglet Principale, et Google Meet en un clic
- Yahoo Mail, AOL Mail, Yandex Mail et Mail.ru : lisez les messages dans le panneau
- Proton Mail : expéditeur, objet et heure dans le panneau ; le message s'ouvre sur le site de Proton, car il est chiffré de bout en bout
- Me le rappeler plus tard : mettez un message de côté jusqu'à ce soir, demain ou la semaine prochaine
- Lire, archiver, supprimer ou signaler comme spam depuis le panneau ou une notification, avec annulation (pas d'archivage pour Yandex Mail et Mail.ru)
- Notifications et son facultatif, avec heures calmes, boîtes silencieuses et règles par expéditeur
- Panneau latéral, raccourci clavier et une touche par action
- Thème clair et sombre, selon votre système
- Sauvegarde des réglages dans un fichier ou dans la synchronisation Chrome
- Gratuit, sans limite de comptes et sans version payante

Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail et Mail.ru n'ont pas d'interface publique pour cela : Mail Deck suit donc leurs propres applications web, et un changement de leur côté peut arrêter l'un d'eux jusqu'à une mise à jour de Mail Deck.

Confidentialité
Mail Deck n'a ni serveurs ni outils d'analyse. Il ne communique qu'avec Google et avec les messageries que vous activez, chacune grâce à la session déjà ouverte dans votre navigateur, et le courrier de chaque service ne va qu'à ce service. Il ne demande ni ne stocke jamais votre mot de passe, et vos réglages restent dans votre navigateur.

Mail Deck est open source sous licence Mozilla Public License 1.1 : https://github.com/EAbychkov/mail-deck
Il n'est ni conçu par Google, Yahoo, AOL, Proton, Yandex ou VK, ni affilié à eux. Gmail est une marque de Google LLC ; les autres noms appartiennent à leurs propriétaires.
```

## Italiano (it)

**Summary:** Posta non letta di Gmail, Yahoo, AOL, Proton, Yandex e Mail.ru in un pannello veloce. Leggi, archivia o elimina senza nuove schede.

```
Mail Deck raccoglie in un pannello della barra degli strumenti la posta non letta di Gmail, Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail e Mail.ru, dagli account a cui hai eseguito l'accesso in questo browser.

Usa la sessione che il browser ha già, come la pagina web del servizio stesso. Niente password, niente password per le app, niente OAuth, nessun server nostro. Gmail funziona subito. Per gli altri, accedi al sito del servizio come sempre e attivalo in Impostazioni → Altra posta; Chrome ti chiede di consentire i siti di quel servizio, e disattivandolo il permesso viene revocato.

Fai clic su un messaggio per leggerlo direttamente nel pannello. Puoi segnarlo come letto, archiviarlo, eliminarlo o segnalarlo come spam senza aprire una scheda. Fai clic su una casella per aprirla sul sito del servizio.

Funzioni
- Tutte le caselle collegate, ognuna con il suo colore e nell'ordine in cui le trascini
- Gmail: fino a dieci account, conversazioni intere con gli allegati, ricerca in tutti gli account, stelle, etichette scelte o solo la scheda Principale, e Google Meet con un clic
- Yahoo Mail, AOL Mail, Yandex Mail e Mail.ru: leggi i messaggi nel pannello
- Proton Mail: mittente, oggetto e ora nel pannello; il messaggio si apre sul sito di Proton, perché è crittografato end-to-end
- Ricordamelo più tardi: metti da parte un messaggio fino a stasera, domani o la settimana prossima
- Leggi, archivia, elimina o segnala come spam dal pannello o da una notifica, con annullamento (Yandex Mail e Mail.ru senza archivio)
- Notifiche e un suono facoltativo, con ore di silenzio, caselle silenziose e regole per mittente
- Pannello laterale, una scorciatoia da tastiera e un tasto per ogni azione
- Tema chiaro e scuro, come il sistema
- Backup delle impostazioni su file o nella sincronizzazione di Chrome
- Gratuito, senza limiti di account e senza versione a pagamento

Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail e Mail.ru non hanno un'interfaccia pubblica per questo, quindi Mail Deck segue le loro app web, e una modifica da parte loro può fermarne uno finché Mail Deck non viene aggiornato.

Privacy
Mail Deck non ha server propri né strumenti di analisi. Comunica solo con Google e con i servizi di posta che attivi, ognuno tramite la sessione già aperta nel browser, e la posta di ogni servizio va solo a quel servizio. Non chiede né conserva mai la tua password, e le impostazioni restano nel tuo browser.

Mail Deck è open source con licenza Mozilla Public License 1.1: https://github.com/EAbychkov/mail-deck
Non è realizzato da Google, Yahoo, AOL, Proton, Yandex o VK né affiliato a loro. Gmail è un marchio di Google LLC; gli altri nomi appartengono ai rispettivi proprietari.
```

## Polski (pl)

**Summary:** Nieprzeczytane z kont Gmail, Yahoo, AOL, Proton, Yandex i Mail.ru w szybkim panelu. Czytaj, archiwizuj i usuwaj bez nowej karty.

```
Mail Deck zbiera w jednym panelu na pasku narzędzi nieprzeczytaną pocztę z Gmaila, Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail i Mail.ru, z kont, na których jesteś zalogowany w tej przeglądarce.

Działa przez sesję, którą przeglądarka już ma, tak jak strona internetowa samej usługi. Bez hasła, bez hasła aplikacji, bez OAuth i bez naszych serwerów. Gmail działa od razu. W przypadku pozostałych zaloguj się jak zwykle na stronie usługi i włącz ją w Ustawieniach → Inna poczta; Chrome poprosi o zezwolenie na strony tej usługi, a wyłączenie jej cofa to uprawnienie.

Kliknij wiadomość, aby przeczytać ją w panelu. Możesz oznaczyć ją jako przeczytaną, zarchiwizować, usunąć lub zgłosić jako spam bez otwierania karty. Kliknij skrzynkę, aby otworzyć ją na stronie usługi.

Funkcje
- Wszystkie zalogowane skrzynki, każda w swoim kolorze i w kolejności, w jakiej je przeciągniesz
- Gmail: do dziesięciu kont, całe rozmowy z załącznikami, wyszukiwanie we wszystkich kontach, gwiazdki, wybrane etykiety lub tylko karta Główne oraz Google Meet jednym kliknięciem
- Yahoo Mail, AOL Mail, Yandex Mail i Mail.ru: wiadomości czytasz w panelu
- Proton Mail: nadawca, temat i godzina w panelu; sama wiadomość otwiera się na stronie Protona, bo jest szyfrowana end-to-end
- Przypomnij później: odłóż wiadomość do wieczora, do jutra albo do przyszłego tygodnia
- Czytaj, archiwizuj, usuwaj lub zgłaszaj spam z panelu albo z powiadomienia, z możliwością cofnięcia (Yandex Mail i Mail.ru bez archiwum)
- Powiadomienia i opcjonalny dźwięk, z godzinami ciszy, wyciszonymi skrzynkami i regułami dla nadawców
- Panel boczny, skrót klawiszowy i jeden klawisz na każdą czynność
- Jasny i ciemny motyw, zgodnie z systemem
- Kopia zapasowa ustawień w pliku lub w synchronizacji Chrome
- Za darmo, bez limitu kont i bez płatnej wersji

Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail i Mail.ru nie mają do tego publicznego interfejsu, więc Mail Deck postępuje tak jak ich własne aplikacje internetowe, a zmiana po ich stronie może zatrzymać którąś z usług do czasu aktualizacji Mail Deck.

Prywatność
Mail Deck nie ma własnych serwerów ani analityki. Łączy się tylko z Google i z usługami pocztowymi, które włączysz, z każdą przez sesję, którą przeglądarka już ma, a poczta każdej usługi trafia tylko do niej. Nigdy nie prosi o hasło ani go nie przechowuje, a ustawienia zostają w przeglądarce.

Mail Deck jest otwartym oprogramowaniem na licencji Mozilla Public License 1.1: https://github.com/EAbychkov/mail-deck
Nie jest tworzony przez Google, Yahoo, AOL, Proton, Yandex ani VK, ani z nimi powiązany. Gmail jest znakiem towarowym Google LLC; pozostałe nazwy należą do ich właścicieli.
```

## Türkçe (tr)

**Summary:** Gmail, Yahoo, AOL, Proton, Yandex ve Mail.ru’daki okunmamış postalar hızlı bir panelde. Sekme açmadan okuyun, arşivleyin veya silin.

```
Mail Deck, bu tarayıcıda oturum açtığınız hesaplardaki Gmail, Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail ve Mail.ru okunmamış postalarını araç çubuğundaki tek bir panelde toplar.

Tarayıcınızda zaten açık olan oturumla, hizmetin kendi web sayfası gibi çalışır. Şifre yok, uygulama şifresi yok, OAuth yok, bizim sunucularımız yok. Gmail hemen çalışır. Diğerleri için hizmetin sitesinde her zamanki gibi oturum açın ve Ayarlar → Diğer e-posta hizmetleri bölümünden etkinleştirin; Chrome o hizmetin sitelerine izin vermenizi ister, kapattığınızda izin geri alınır.

Bir iletiyi doğrudan panelde okumak için tıklayın. İletiyi sekme açmadan okundu olarak işaretleyebilir, arşivleyebilir, silebilir veya spam olarak bildirebilirsiniz. Bir posta kutusunu hizmetin sitesinde açmak için tıklayın.

Özellikler
- Oturum açılmış tüm posta kutuları, her biri kendi renginde ve sürüklediğiniz sırada
- Gmail: ona kadar hesap, ekleriyle birlikte tüm yazışma, tüm hesaplarda arama, yıldızlar, seçtiğiniz etiketler veya yalnızca Birincil sekmesi ve tek tıkla Google Meet
- Yahoo Mail, AOL Mail, Yandex Mail ve Mail.ru: iletileri panelde okuyun
- Proton Mail: gönderen, konu ve saat panelde; iletinin kendisi uçtan uca şifreli olduğu için Proton'un sitesinde açılır
- Sonra hatırlat: bir iletiyi bu akşama, yarına veya gelecek haftaya kadar kenara koyun
- Panelden veya bir bildirimden okuma, arşivleme, silme veya spam bildirme, geri alma ile (Yandex Mail ve Mail.ru'da arşiv yok)
- Bildirimler ve isteğe bağlı ses; sessiz saatler, sessiz kutular ve gönderen kurallarıyla
- Yan panel, bir klavye kısayolu ve her işlem için tek tuş
- Sisteminize uyan açık ve koyu tema
- Ayarların bir dosyaya veya Chrome senkronizasyonuna yedeklenmesi
- Ücretsiz, hesap sınırı ve ücretli sürüm yok

Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail ve Mail.ru'nun bunun için herkese açık bir arayüzü yoktur; bu yüzden Mail Deck onların kendi web uygulamalarını izler ve onların tarafındaki bir değişiklik, Mail Deck güncellenene kadar bir hizmeti durdurabilir.

Gizlilik
Mail Deck'in kendi sunucuları ve analitiği yoktur. Yalnızca Google ve etkinleştirdiğiniz e-posta hizmetleriyle, her biri için tarayıcınızda zaten açık olan oturumla konuşur ve her hizmetin postası yalnızca o hizmete gider. Şifrenizi asla istemez veya saklamaz, ayarlarınız tarayıcınızda kalır.

Mail Deck, Mozilla Public License 1.1 lisansıyla açık kaynaklıdır: https://github.com/EAbychkov/mail-deck
Google, Yahoo, AOL, Proton, Yandex veya VK tarafından yapılmamıştır ve onlarla bağlantılı değildir. Gmail, Google LLC'nin ticari markasıdır; diğer adlar sahiplerine aittir.
```

## Nederlands (nl)

**Summary:** Ongelezen mail van Gmail, Yahoo, AOL, Proton, Yandex en Mail.ru in één snel paneel. Lees, archiveer of verwijder zonder nieuwe tab.

```
Mail Deck zet de ongelezen mail van Gmail, Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail en Mail.ru in één paneel op de werkbalk, uit de accounts waarop je in deze browser bent ingelogd.

Het werkt via de sessie die je browser al heeft, zoals de webpagina van de dienst zelf. Geen wachtwoord, geen app-wachtwoord, geen OAuth, geen servers van ons. Gmail werkt meteen. Voor de andere log je zoals gewoonlijk in op de site van de dienst en zet je hem aan bij Instellingen → Andere mail; Chrome vraagt dan of je de sites van die dienst toestaat, en uitzetten trekt de toestemming weer in.

Klik op een bericht om het direct in het paneel te lezen. Je kunt het als gelezen markeren, archiveren, verwijderen of als spam melden zonder een tabblad te openen. Klik op een inbox om hem op de site van de dienst te openen.

Functies
- Alle ingelogde mailboxen, elk met een eigen kleur en in de volgorde waarin je ze sleept
- Gmail: tot tien accounts, hele gesprekken met bijlagen, zoeken in alle accounts, sterren, gekozen labels of alleen het tabblad Primair, en Google Meet met één klik
- Yahoo Mail, AOL Mail, Yandex Mail en Mail.ru: berichten lees je in het paneel
- Proton Mail: afzender, onderwerp en tijd in het paneel; het bericht zelf opent op de site van Proton, omdat het end-to-end versleuteld is
- Later herinneren: leg een bericht weg tot vanavond, morgen of volgende week
- Lezen, archiveren, verwijderen of als spam melden vanuit het paneel of een melding, met ongedaan maken (Yandex Mail en Mail.ru zonder archief)
- Meldingen en een optioneel geluid, met stille uren, stille inboxen en regels voor afzenders
- Zijpaneel, een sneltoets en één toets per actie
- Licht en donker thema, zoals je systeem
- Back-up van je instellingen in een bestand of in Chrome-synchronisatie
- Gratis, zonder limiet op accounts en zonder betaalde versie

Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail en Mail.ru hebben hiervoor geen openbare interface. Mail Deck volgt daarom hun eigen webapps, en een wijziging aan hun kant kan een dienst stilleggen tot Mail Deck is bijgewerkt.

Privacy
Mail Deck heeft geen eigen servers en geen analyse. Het praat alleen met Google en met de maildiensten die je aanzet, elk via de sessie die je browser al heeft, en de mail van elke dienst gaat alleen naar die dienst. Het vraagt nooit naar je wachtwoord en bewaart het niet, en je instellingen blijven in je browser.

Mail Deck is open source onder de Mozilla Public License 1.1: https://github.com/EAbychkov/mail-deck
Het is niet gemaakt door of verbonden met Google, Yahoo, AOL, Proton, Yandex of VK. Gmail is een handelsmerk van Google LLC; de andere namen zijn van hun eigenaars.
```

## 日本語 (ja)

**Summary:** Gmail、Yahoo、AOL、Proton、Yandex、Mail.ru の未読メールを 1 つの高速パネルに。タブを開かずに読む、アーカイブ、削除。

```
Mail Deck は、このブラウザでログインしているアカウントの Gmail、Yahoo Mail、AOL Mail、Proton Mail、Yandex Mail、Mail.ru の未読メールを、ツールバーの 1 つのパネルにまとめます。

各サービスのウェブページと同じように、ブラウザにすでにあるセッションを使って動作します。パスワードもアプリ パスワードも OAuth も不要で、私たちのサーバーも介しません。Gmail はすぐに使えます。その他のサービスは、いつもどおりサービスのサイトでログインし、[設定] → [その他のメール] でオンにします。Chrome がそのサービスのサイトへのアクセス許可を求め、オフにすると許可は取り消されます。

メールをクリックすると、パネル内でそのまま読めます。タブを開かずに、既読にする、アーカイブ、削除、迷惑メールとして報告ができます。メールボックスをクリックすると、そのサービスのサイトで開きます。

機能
- ログイン中のすべてのメールボックス。それぞれに色が付き、ドラッグで並べ替え可能
- Gmail: 最大 10 アカウント、添付ファイルを含むスレッド全体の表示、全アカウントの検索、スター、選んだラベルまたはメインタブのみの表示、ワンクリックで Google Meet
- Yahoo Mail、AOL Mail、Yandex Mail、Mail.ru: メールをパネル内で表示
- Proton Mail: 送信者、件名、日時をパネルに表示。メールはエンドツーエンドで暗号化されているため、Proton のサイトで開きます
- 後でリマインド: メールを今夜、明日、来週まで一時的に非表示
- パネルや通知から既読、アーカイブ、削除、迷惑メール報告。元に戻すことも可能（Yandex Mail と Mail.ru はアーカイブ非対応）
- 通知と任意のサウンド。おやすみ時間、通知しないメールボックス、送信者ごとのルール付き
- サイドパネル、キーボード ショートカット、操作ごとに 1 つのキー
- システムに合わせたライト テーマとダーク テーマ
- 設定をファイルまたは Chrome の同期にバックアップ
- 無料。アカウント数の制限や有料プランはありません

Yahoo Mail、AOL Mail、Proton Mail、Yandex Mail、Mail.ru にはこのための公開インターフェースがないため、Mail Deck は各サービスのウェブアプリと同じ方法で動作します。サービス側の変更により、Mail Deck が更新されるまでそのサービスが使えなくなることがあります。

プライバシー
Mail Deck は独自のサーバーも分析ツールも持ちません。通信するのは Google と、オンにしたメールサービスだけで、いずれもブラウザにすでにあるセッションを使います。各サービスのメールはそのサービスにだけ送られます。パスワードを尋ねたり保存したりすることはなく、設定はブラウザ内に保存されます。

Mail Deck は Mozilla Public License 1.1 のオープンソースです: https://github.com/EAbychkov/mail-deck
Google、Yahoo、AOL、Proton、Yandex、VK が作成したものではなく、これらの企業とは関係ありません。Gmail は Google LLC の商標です。その他の名称は各所有者に帰属します。
```

## 简体中文 (zh_CN)

**Summary:** 将 Gmail、Yahoo、AOL、Proton、Yandex 和 Mail.ru 的未读邮件集中到一个快速面板中。无需打开标签页，即可阅读、归档或删除。

```
Mail Deck 将你在此浏览器中已登录账号的 Gmail、Yahoo Mail、AOL Mail、Proton Mail、Yandex Mail 和 Mail.ru 未读邮件，集中到工具栏上的一个面板中。

它像各服务自己的网页一样，使用浏览器中已有的会话工作。无需密码、应用专用密码或 OAuth，也不经过我们的任何服务器。Gmail 安装后即可使用。其他服务只需像平常一样在其网站登录，然后在“设置”→“其他邮箱”中开启；Chrome 会请求你允许访问该服务的网站，关闭后该权限即被移除。

点击一封邮件，即可直接在面板中阅读。无需打开标签页，即可将其标为已读、归档、删除或举报为垃圾邮件。点击某个邮箱即可在该服务的网站中打开它。

功能
- 所有已登录的邮箱，每个邮箱一种颜色，可拖动调整顺序
- Gmail：最多十个账号，包括附件在内的完整会话，跨账号搜索，星标，选定的标签或仅“主要”标签页，一键发起 Google Meet
- Yahoo Mail、AOL Mail、Yandex Mail 和 Mail.ru：直接在面板中阅读邮件
- Proton Mail：面板中显示发件人、主题和时间；邮件采用端到端加密，因此会在 Proton 网站中打开
- 稍后提醒：把邮件暂时放到今晚、明天或下周
- 在面板或通知中阅读、归档、删除或举报垃圾邮件，并可撤销（Yandex Mail 和 Mail.ru 不支持归档）
- 新邮件通知和可选提示音，支持免打扰时段、静音邮箱和发件人规则
- 侧边栏、键盘快捷键，每个操作一个按键
- 浅色和深色主题，跟随系统
- 将设置备份到文件或 Chrome 同步
- 完全免费，不限账号数量，没有付费版本

Yahoo Mail、AOL Mail、Proton Mail、Yandex Mail 和 Mail.ru 没有为此提供公开接口，因此 Mail Deck 采用与它们自己的网页应用相同的方式；如果这些服务做出改动，相应服务可能会停止工作，直到 Mail Deck 更新。

隐私
Mail Deck 没有自己的服务器，也不做任何统计分析。它只与 Google 和你开启的邮件服务通信，并且都使用浏览器中已有的会话；每个服务的邮件只发送到该服务。它从不询问或保存你的密码，你的设置只保存在浏览器中。

Mail Deck 采用 Mozilla Public License 1.1 开源：https://github.com/EAbychkov/mail-deck
本扩展并非由 Google、Yahoo、AOL、Proton、Yandex 或 VK 开发，与它们无关。Gmail 是 Google LLC 的商标；其他名称归各自所有者所有。
```

## Português do Brasil (pt_BR)

**Summary:** E-mails não lidos do Gmail, Yahoo, AOL, Proton, Yandex e Mail.ru em um painel rápido. Leia, arquive ou exclua sem abrir uma guia.

```
O Mail Deck reúne em um painel na barra de ferramentas os e-mails não lidos do Gmail, Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail e Mail.ru, das contas em que você está conectado neste navegador.

Ele funciona com a sessão que o navegador já tem, como a própria página web de cada serviço. Sem senha, sem senha de app, sem OAuth e sem servidores nossos. O Gmail funciona na hora. Para os outros, entre no site do serviço como de costume e ative-o em Configurações → Outros e-mails; o Chrome pede que você permita os sites desse serviço, e desativá-lo retira a permissão.

Clique em uma mensagem para lê-la no próprio painel. Você pode marcá-la como lida, arquivá-la, excluí-la ou denunciá-la como spam sem abrir uma guia. Clique em uma caixa de entrada para abri-la no site do serviço.

Recursos
- Todas as caixas de entrada conectadas, cada uma com sua cor e na ordem em que você arrastar
- Gmail: até dez contas, conversas inteiras com os anexos, pesquisa em todas as contas, estrelas, os marcadores escolhidos ou só a guia Principal, e Google Meet com um clique
- Yahoo Mail, AOL Mail, Yandex Mail e Mail.ru: leia as mensagens no painel
- Proton Mail: remetente, assunto e horário no painel; a mensagem abre no site do Proton, porque tem criptografia de ponta a ponta
- Lembrar mais tarde: deixe uma mensagem de lado até hoje à noite, amanhã ou a próxima semana
- Ler, arquivar, excluir ou denunciar spam pelo painel ou por uma notificação, com opção de desfazer (Yandex Mail e Mail.ru sem arquivamento)
- Notificações e um som opcional, com horário silencioso, caixas silenciadas e regras por remetente
- Painel lateral, um atalho de teclado e uma tecla para cada ação
- Tema claro e escuro, de acordo com o sistema
- Backup das configurações em um arquivo ou na sincronização do Chrome
- Gratuito, sem limite de contas e sem versão paga

Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail e Mail.ru não têm uma interface pública para isso, então o Mail Deck segue os próprios apps web deles, e uma mudança do lado deles pode parar um serviço até o Mail Deck ser atualizado.

Privacidade
O Mail Deck não tem servidores próprios nem análises. Ele se comunica só com o Google e com os serviços de e-mail que você ativar, cada um com a sessão que o navegador já tem, e o e-mail de cada serviço vai só para esse serviço. Ele nunca pede nem guarda sua senha, e suas configurações ficam no navegador.

O Mail Deck é de código aberto sob a Mozilla Public License 1.1: https://github.com/EAbychkov/mail-deck
Ele não é feito pelo Google, Yahoo, AOL, Proton, Yandex ou VK nem afiliado a eles. Gmail é uma marca registrada da Google LLC; os outros nomes pertencem aos seus donos.
```

## العربية (ar)

**Summary:** البريد غير المقروء من Gmail وYahoo وAOL وProton وYandex وMail.ru في لوحة واحدة سريعة. اقرأه أو أرشفه أو احذفه دون فتح علامة تبويب.

```
يجمع Mail Deck في لوحة واحدة على شريط الأدوات البريد غير المقروء من Gmail وYahoo Mail وAOL Mail وProton Mail وYandex Mail وMail.ru، من الحسابات التي سجّلت الدخول إليها في هذا المتصفح.

يعمل عبر الجلسة الموجودة أصلًا في متصفحك، كما تفعل صفحة الويب الخاصة بكل خدمة. لا كلمة مرور، ولا كلمة مرور للتطبيقات، ولا OAuth، ولا خوادم تابعة لنا. يعمل Gmail مباشرة. أما الخدمات الأخرى، فسجّل الدخول إلى موقع الخدمة كالمعتاد ثم فعّلها من الإعدادات ← بريد آخر؛ سيطلب منك Chrome السماح بمواقع تلك الخدمة، وعند إيقافها يُسحب الإذن.

انقر على رسالة لتقرأها داخل اللوحة مباشرة. يمكنك تعليمها كمقروءة أو أرشفتها أو حذفها أو الإبلاغ عنها كرسالة غير مرغوب فيها دون فتح علامة تبويب. وانقر على صندوق بريد لفتحه على موقع خدمته.

الميزات
- كل صناديق البريد التي سجّلت الدخول إليها، لكلٍّ منها لونه الخاص، وبالترتيب الذي تختاره بالسحب
- Gmail: حتى عشرة حسابات، والمحادثات كاملة مع المرفقات، والبحث في كل الحسابات، والنجوم، والتصنيفات التي تختارها أو علامة التبويب «الأساسية» فقط، وGoogle Meet بنقرة واحدة
- Yahoo Mail وAOL Mail وYandex Mail وMail.ru: قراءة الرسائل داخل اللوحة
- Proton Mail: المرسل والموضوع والوقت في اللوحة؛ أما الرسالة نفسها فتُفتح على موقع Proton لأنها مشفّرة تشفيرًا تامًّا بين الطرفين
- «ذكّرني لاحقًا»: ضع الرسالة جانبًا حتى هذا المساء أو الغد أو الأسبوع القادم
- تعليم الرسائل كمقروءة وأرشفتها وحذفها والإبلاغ عن الرسائل غير المرغوب فيها من اللوحة أو من إشعار، مع إمكانية التراجع (لا أرشفة في Yandex Mail وMail.ru)
- إشعارات وصوت اختياري، مع ساعات الهدوء وصناديق بريد صامتة وقواعد حسب المرسل
- لوحة جانبية واختصار لوحة مفاتيح ومفتاح واحد لكل إجراء
- مظهر فاتح وآخر داكن يتبعان إعدادات نظامك
- نسخ احتياطي للإعدادات في ملف أو عبر مزامنة Chrome
- مجاني، بلا حدّ لعدد الحسابات وبلا أي نسخة مدفوعة

ليس لدى Yahoo Mail وAOL Mail وProton Mail وYandex Mail وMail.ru واجهة عامة لهذا الغرض، لذلك يتبع Mail Deck تطبيقات الويب الخاصة بها، وقد يوقف تغييرٌ من جهتها إحدى الخدمات إلى أن يُحدَّث Mail Deck.

الخصوصية
ليس لدى Mail Deck خوادم خاصة به ولا أدوات تحليلات. لا يتواصل إلا مع Google ومع خدمات البريد التي تفعّلها، مستخدمًا لكلٍّ منها الجلسة الموجودة أصلًا في متصفحك، ولا يذهب بريد كل خدمة إلا إليها. لا يطلب كلمة مرورك أبدًا ولا يخزّنها، وتبقى إعداداتك في متصفحك.

يتوفر Mail Deck كبرنامج مفتوح المصدر بموجب رخصة Mozilla Public License 1.1: https://github.com/EAbychkov/mail-deck
لم تطوّره Google أو Yahoo أو AOL أو Proton أو Yandex أو VK وليس تابعًا لأيٍّ منها. Gmail علامة تجارية لشركة Google LLC، والأسماء الأخرى ملك لأصحابها.
```

## Български (bg)

**Summary:** Непрочетената поща от Gmail, Yahoo, AOL, Proton, Yandex и Mail.ru в бърз панел. Четете, архивирайте и изтривайте без нов раздел.

```
Mail Deck събира в един панел в лентата с инструменти непрочетената поща от Gmail, Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail и Mail.ru от профилите, в които сте влезли в този браузър.

Работи чрез сесията, която браузърът ви вече има, както уеб страницата на самата услуга. Без парола, без парола за приложение, без OAuth и без наши сървъри. Gmail работи веднага. За останалите влезте в сайта на услугата както обикновено и я включете от „Настройки“ → „Друга поща“; Chrome ще поиска да разрешите сайтовете на тази услуга, а изключването ѝ отнема разрешението.

Щракнете върху писмо, за да го прочетете направо в панела. Можете да го маркирате като прочетено, да го архивирате, да го изтриете или да подадете сигнал за спам, без да отваряте раздел. Щракнете върху пощенска кутия, за да я отворите в сайта на услугата.

Функции
- Всички пощенски кутии, в които сте влезли, всяка със свой цвят и в реда, в който ги подредите с плъзгане
- Gmail: до десет профила, цели разговори с прикачените файлове, търсене във всички профили, звезди, избрани етикети или само разделът „Основни“ и Google Meet с едно щракване
- Yahoo Mail, AOL Mail, Yandex Mail и Mail.ru: писмата се четат направо в панела
- Proton Mail: подател, тема и час в панела; самото писмо се отваря в сайта на Proton, защото е шифровано от край до край
- „Напомняне по-късно“: отложете писмо до довечера, до утре или до следващата седмица
- Маркиране като прочетено, архивиране, изтриване и сигнал за спам от панела или от известие, с отмяна (Yandex Mail и Mail.ru без архив)
- Известия и звук по желание, с тихи часове, тихи пощенски кутии и правила за податели
- Страничен панел, клавишна комбинация и по един клавиш за всяко действие
- Светла и тъмна тема според системата
- Резервно копие на настройките във файл или в синхронизирането на Chrome
- Безплатно, без ограничение на броя профили и без платена версия

Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail и Mail.ru нямат публичен интерфейс за това, затова Mail Deck следва собствените им уеб приложения, а промяна от тяхна страна може да спре някоя услуга, докато Mail Deck не бъде обновен.

Поверителност
Mail Deck няма собствени сървъри и не използва аналитика. Разширението се свързва само с Google и с пощенските услуги, които включите, с всяка чрез сесията, която браузърът ви вече има, и пощата на всяка услуга отива само към нея. То никога не иска и не съхранява паролата ви, а настройките ви остават в браузъра.

Mail Deck е с отворен код под лиценза Mozilla Public License 1.1: https://github.com/EAbychkov/mail-deck
Разширението не е създадено от Google, Yahoo, AOL, Proton, Yandex или VK и не е свързано с тях. Gmail е търговска марка на Google LLC; другите имена принадлежат на техните собственици.
```

## Català (ca)

**Summary:** Correu no llegit de Gmail, Yahoo, AOL, Proton, Yandex i Mail.ru en un tauler ràpid. Llegeix, arxiva o suprimeix sense cap pestanya.

```
Mail Deck reuneix en un sol tauler de la barra d'eines el correu no llegit de Gmail, Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail i Mail.ru, dels comptes amb què has iniciat la sessió en aquest navegador.

Funciona amb la sessió que el navegador ja té, igual que la pàgina web del mateix servei. Sense contrasenya, sense contrasenya d'aplicació, sense OAuth i sense servidors nostres. Gmail funciona de seguida. Per als altres, inicia la sessió al lloc del servei com sempre i activa'l a Opcions → Altre correu; Chrome et demanarà que permetis els llocs d'aquell servei, i desactivar-lo retira el permís.

Fes clic en un missatge per llegir-lo al mateix tauler. Pots marcar-lo com a llegit, arxivar-lo, suprimir-lo o marcar-lo com a correu brossa sense obrir cap pestanya. Fes clic en una bústia per obrir-la al lloc del servei.

Funcions
- Totes les bústies amb la sessió iniciada, cadascuna amb el seu color i en l'ordre en què les arrosseguis
- Gmail: fins a deu comptes, converses senceres amb els fitxers adjunts, cerca a tots els comptes, estrelles, les etiquetes que triïs o només la pestanya «Principal», i Google Meet amb un clic
- Yahoo Mail, AOL Mail, Yandex Mail i Mail.ru: llegeix els missatges al tauler
- Proton Mail: remitent, assumpte i hora al tauler; el missatge s'obre al lloc de Proton, perquè està xifrat d'extrem a extrem
- «Recorda-m'ho més tard»: aparta un missatge fins aquesta tarda, fins demà o fins a la setmana que ve
- Marcar com a llegit, arxivar, suprimir o marcar com a correu brossa des del tauler o d'una notificació, amb opció de desfer (Yandex Mail i Mail.ru sense arxiu)
- Notificacions i un so opcional, amb hores de silenci, bústies silenciades i regles per remitent
- Tauler lateral, una drecera de teclat i una tecla per a cada acció
- Tema clar i fosc, segons el sistema
- Còpia de seguretat de les opcions en un fitxer o a la sincronització de Chrome
- Gratuït, sense límit de comptes i sense cap versió de pagament

Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail i Mail.ru no tenen cap interfície pública per a això, així que Mail Deck segueix les seves pròpies aplicacions web, i un canvi per part seva en pot aturar un fins que Mail Deck s'actualitzi.

Privadesa
Mail Deck no té servidors propis ni cap eina d'analítica. Només es comunica amb Google i amb els serveis de correu que activis, cadascun amb la sessió que el navegador ja té oberta, i el correu de cada servei només va a aquell servei. Mai no et demana la contrasenya ni la desa, i les teves opcions es queden al navegador.

Mail Deck és de codi obert, amb la llicència Mozilla Public License 1.1: https://github.com/EAbychkov/mail-deck
No l'han creat Google, Yahoo, AOL, Proton, Yandex ni VK, ni hi està vinculat. Gmail és una marca comercial de Google LLC; els altres noms pertanyen als seus propietaris.
```

## Ελληνικά (el)

**Summary:** Αδιάβαστα από Gmail, Yahoo, AOL, Proton, Yandex και Mail.ru σε γρήγορο πλαίσιο. Διαβάστε, αρχειοθετήστε ή διαγράψτε χωρίς καρτέλες.

```
Το Mail Deck συγκεντρώνει σε έναν πίνακα στη γραμμή εργαλείων τα αδιάβαστα μηνύματα από Gmail, Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail και Mail.ru, από τους λογαριασμούς στους οποίους είστε συνδεδεμένοι σε αυτό το πρόγραμμα περιήγησης.

Λειτουργεί μέσω της περιόδου σύνδεσης που έχει ήδη το πρόγραμμα περιήγησής σας, όπως η ίδια η ιστοσελίδα κάθε υπηρεσίας. Χωρίς κωδικό πρόσβασης, χωρίς κωδικό εφαρμογής, χωρίς OAuth και χωρίς δικούς μας διακομιστές. Το Gmail λειτουργεί αμέσως. Για τις άλλες, συνδεθείτε στον ιστότοπο της υπηρεσίας ως συνήθως και ενεργοποιήστε την στις Ρυθμίσεις → Άλλη αλληλογραφία· το Chrome θα σας ζητήσει να επιτρέψετε τους ιστότοπους αυτής της υπηρεσίας, και η απενεργοποίηση αφαιρεί την άδεια.

Κάντε κλικ σε ένα μήνυμα για να το διαβάσετε μέσα στον πίνακα. Μπορείτε να το επισημάνετε ως αναγνωσμένο, να το αρχειοθετήσετε, να το διαγράψετε ή να το αναφέρετε ως spam χωρίς να ανοίξετε καρτέλα. Κάντε κλικ σε ένα γραμματοκιβώτιο για να το ανοίξετε στον ιστότοπο της υπηρεσίας.

Λειτουργίες
- Όλα τα γραμματοκιβώτια στα οποία είστε συνδεδεμένοι, το καθένα με δικό του χρώμα και με τη σειρά που ορίζετε σύροντάς τα
- Gmail: έως δέκα λογαριασμοί, ολόκληρες συζητήσεις με τα συνημμένα, αναζήτηση σε όλους τους λογαριασμούς, αστέρια, επιλεγμένες ετικέτες ή μόνο η καρτέλα «Κύρια», και Google Meet με ένα κλικ
- Yahoo Mail, AOL Mail, Yandex Mail και Mail.ru: ανάγνωση μηνυμάτων μέσα στον πίνακα
- Proton Mail: αποστολέας, θέμα και ώρα στον πίνακα· το ίδιο το μήνυμα ανοίγει στον ιστότοπο της Proton, επειδή είναι κρυπτογραφημένο από άκρο σε άκρο
- «Υπενθύμιση αργότερα»: αφήστε ένα μήνυμα στην άκρη μέχρι σήμερα το απόγευμα, μέχρι αύριο ή μέχρι την επόμενη εβδομάδα
- Επισήμανση ως αναγνωσμένο, αρχειοθέτηση, διαγραφή ή αναφορά ως spam από τον πίνακα ή από μια ειδοποίηση, με δυνατότητα αναίρεσης (χωρίς αρχειοθέτηση στα Yandex Mail και Mail.ru)
- Ειδοποιήσεις και προαιρετικός ήχος, με ώρες ησυχίας, σιωπηλά γραμματοκιβώτια και κανόνες ανά αποστολέα
- Πλαϊνός πίνακας, συντόμευση πληκτρολογίου και ένα πλήκτρο για κάθε ενέργεια
- Ανοιχτό και σκούρο θέμα, ανάλογα με το σύστημά σας
- Αντίγραφο ασφαλείας των ρυθμίσεων σε αρχείο ή στον συγχρονισμό του Chrome
- Δωρεάν, χωρίς όριο λογαριασμών και χωρίς έκδοση επί πληρωμή

Τα Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail και Mail.ru δεν έχουν δημόσια διεπαφή για αυτό, γι' αυτό το Mail Deck ακολουθεί τις δικές τους εφαρμογές ιστού, και μια αλλαγή από την πλευρά τους μπορεί να σταματήσει μια υπηρεσία μέχρι να ενημερωθεί το Mail Deck.

Απόρρητο
Το Mail Deck δεν έχει δικούς του διακομιστές ούτε εργαλεία ανάλυσης. Επικοινωνεί μόνο με την Google και με τις υπηρεσίες αλληλογραφίας που ενεργοποιείτε, με την καθεμία μέσω της περιόδου σύνδεσης που έχει ήδη το πρόγραμμα περιήγησής σας, και η αλληλογραφία κάθε υπηρεσίας πηγαίνει μόνο σε αυτήν. Δεν ζητά ούτε αποθηκεύει ποτέ τον κωδικό πρόσβασής σας, και οι ρυθμίσεις σας μένουν στο πρόγραμμα περιήγησης.

Το Mail Deck είναι ανοιχτού κώδικα, με την άδεια Mozilla Public License 1.1: https://github.com/EAbychkov/mail-deck
Δεν έχει δημιουργηθεί από τις Google, Yahoo, AOL, Proton, Yandex ή VK και δεν συνδέεται με αυτές. Το Gmail είναι εμπορικό σήμα της Google LLC· τα άλλα ονόματα ανήκουν στους κατόχους τους.
```

## עברית (he)

**Summary:** הדואר שלא נקרא מ-Gmail, Yahoo, AOL, Proton, Yandex ו-Mail.ru בחלונית מהירה אחת. קראו, העבירו לארכיון או מחקו בלי לפתוח כרטיסייה.

```
התוסף Mail Deck מרכז בחלונית אחת בסרגל הכלים את הדואר שלא נקרא מ-Gmail, Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail ו-Mail.ru, מהחשבונות שאליהם התחברתם בדפדפן הזה.

הוא עובד דרך ההתחברות שכבר פעילה בדפדפן, בדיוק כמו דף האינטרנט של השירות עצמו. בלי סיסמה, בלי סיסמת אפליקציה, בלי OAuth ובלי שרתים שלנו. Gmail עובד מיד. בשירותים האחרים, התחברו לאתר השירות כרגיל והפעילו אותו בהגדרות ← דואר אחר; Chrome יבקש מכם לאשר את האתרים של אותו שירות, וכיבוי השירות מבטל את ההרשאה.

לחצו על הודעה כדי לקרוא אותה ישירות בחלונית. אפשר לסמן אותה כנקראה, להעביר אותה לארכיון, למחוק אותה או לדווח עליה כספאם בלי לפתוח כרטיסייה. לחצו על תיבת דואר כדי לפתוח אותה באתר השירות.

תכונות
- כל תיבות הדואר שאליהן התחברתם, כל אחת בצבע משלה ובסדר שתקבעו בגרירה
- Gmail: עד עשרה חשבונות, שיחות שלמות כולל קבצים מצורפים, חיפוש בכל החשבונות, כוכבים, תוויות נבחרות או רק הכרטיסייה ״ראשי״, ו-Google Meet בלחיצה אחת
- Yahoo Mail, AOL Mail, Yandex Mail ו-Mail.ru: קריאת ההודעות ישירות בחלונית
- Proton Mail: השולח, הנושא והשעה בחלונית; ההודעה עצמה נפתחת באתר של Proton, כי היא מוצפנת מקצה לקצה
- ״הזכר לי מאוחר יותר״: הניחו הודעה בצד עד הערב, עד מחר או עד השבוע הבא
- סימון כנקראה, העברה לארכיון, מחיקה ודיווח כספאם מהחלונית או מהתראה, עם אפשרות ביטול (ב-Yandex Mail וב-Mail.ru אין ארכיון)
- התראות וצליל לבחירה, עם שעות שקט, תיבות דואר שקטות וכללים לפי שולח
- חלונית צד, קיצור מקלדת ומקש אחד לכל פעולה
- ערכת נושא בהירה וכהה, בהתאם למערכת
- גיבוי ההגדרות לקובץ או לסנכרון של Chrome
- חינם, בלי הגבלה על מספר החשבונות ובלי גרסה בתשלום

ל-Yahoo Mail, ל-AOL Mail, ל-Proton Mail, ל-Yandex Mail ול-Mail.ru אין ממשק ציבורי לכך, ולכן Mail Deck פועל כמו אפליקציות האינטרנט שלהם עצמם, ושינוי בצד שלהם עלול לעצור שירות עד ש-Mail Deck יעודכן.

פרטיות
ל-Mail Deck אין שרתים משלו ואין כלי ניתוח נתונים. הוא מתקשר רק עם Google ועם שירותי הדואר שהפעלתם, כל אחד דרך ההתחברות שכבר פעילה בדפדפן שלכם, והדואר של כל שירות נשלח רק אליו. הוא אף פעם לא מבקש את הסיסמה שלכם ולא שומר אותה, וההגדרות שלכם נשארות בדפדפן.

הקוד של Mail Deck פתוח, ברישיון Mozilla Public License 1.1: https://github.com/EAbychkov/mail-deck
התוסף לא נוצר על ידי Google, Yahoo, AOL, Proton, Yandex או VK ואינו קשור אליהן. Gmail הוא סימן מסחרי של Google LLC; שאר השמות שייכים לבעליהם.
```

## Magyar (hu)

**Summary:** Gmail, Yahoo, AOL, Proton, Yandex és Mail.ru olvasatlan levelei egy gyors panelen. Olvasd, archiváld vagy töröld lapnyitás nélkül.

```
A Mail Deck egyetlen panelre gyűjti az eszköztáron a Gmail, a Yahoo Mail, az AOL Mail, a Proton Mail, a Yandex Mail és a Mail.ru olvasatlan leveleit azokból a fiókokból, amelyekbe ebben a böngészőben be vagy jelentkezve.

A böngésződben már meglévő munkamenettel működik, ugyanúgy, mint a szolgáltatás saját weboldala. Nincs jelszó, nincs alkalmazásjelszó, nincs OAuth, és nincsenek saját szervereink. A Gmail azonnal működik. A többinél jelentkezz be a szolgáltatás oldalán a szokásos módon, majd kapcsold be a Beállítások → Más levelezőszolgáltatók részben; a Chrome engedélyt kér a szolgáltatás oldalaihoz, kikapcsoláskor pedig az engedély megszűnik.

Kattints egy levélre, és magában a panelen olvashatod el. Olvasottnak jelölheted, archiválhatod, törölheted vagy spamként jelentheted anélkül, hogy lapot nyitnál. Ha egy postafiókra kattintasz, megnyílik a szolgáltatás oldalán.

Funkciók
- Az összes bejelentkezett postafiók, mindegyik saját színnel, abban a sorrendben, ahogy áthúzással elrendezed őket
- Gmail: legfeljebb tíz fiók, teljes beszélgetések a mellékletekkel, keresés az összes fiókban, csillagok, kiválasztott címkék vagy csak az „Elsődleges” lap, és Google Meet egy kattintással
- Yahoo Mail, AOL Mail, Yandex Mail és Mail.ru: a levelek a panelen olvashatók
- Proton Mail: feladó, tárgy és időpont a panelen; maga a levél a Proton oldalán nyílik meg, mert végponttól végpontig titkosított
- „Emlékeztetés később”: tedd félre a levelet ma estig, holnapig vagy jövő hétig
- Olvasottnak jelölés, archiválás, törlés és spam bejelentése a panelről vagy egy értesítésből, visszavonási lehetőséggel (a Yandex Mail és a Mail.ru archiválás nélkül)
- Értesítések és választható hang, csendes órákkal, néma postafiókokkal és feladók szerinti szabályokkal
- Oldalsó panel, billentyűparancs és műveletenként egy billentyű
- Világos és sötét téma, a rendszerhez igazodva
- A beállítások biztonsági mentése fájlba vagy a Chrome-szinkronizálásba
- Ingyenes, fiókkorlát és fizetős változat nélkül

A Yahoo Mail, az AOL Mail, a Proton Mail, a Yandex Mail és a Mail.ru nem kínál ehhez nyilvános felületet, ezért a Mail Deck a saját webalkalmazásaikat követi, és egy változás az ő oldalukon leállíthat egy szolgáltatást, amíg a Mail Deck frissítést nem kap.

Adatvédelem
A Mail Deck nem rendelkezik saját szerverekkel, és nem használ analitikát. Csak a Google-lal és a bekapcsolt levelezőszolgáltatásokkal kommunikál, mindegyikkel a böngésződben már meglévő munkameneten keresztül, és minden szolgáltatás levelei csak az adott szolgáltatáshoz jutnak el. Soha nem kéri el és nem tárolja a jelszavadat, a beállításaid pedig a böngésződben maradnak.

A Mail Deck nyílt forráskódú, a Mozilla Public License 1.1 feltételei szerint: https://github.com/EAbychkov/mail-deck
Nem a Google, a Yahoo, az AOL, a Proton, a Yandex vagy a VK készítette, és nem áll kapcsolatban velük. A Gmail a Google LLC védjegye; a többi név a tulajdonosaié.
```

## Српски (sr)

**Summary:** Непрочитана пошта Gmail, Yahoo, AOL, Proton, Yandex и Mail.ru налога у брзом панелу. Читајте, архивирајте, бришите без нове картице.

```
Mail Deck окупља у један панел на траци с алаткама непрочитану пошту из сервиса Gmail, Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail и Mail.ru, са налога на које сте пријављени у овом прегледачу.

Ради преко сесије коју ваш прегледач већ има, као и веб-страница самог сервиса. Без лозинке, без лозинке за апликацију, без OAuth-а и без наших сервера. Gmail ради одмах. За остале, пријавите се на сајт сервиса као и обично и укључите га у Подешавањима → Друга пошта; Chrome ће затражити да дозволите сајтове тог сервиса, а искључивање повлачи дозволу.

Кликните на поруку да бисте је прочитали у самом панелу. Можете је означити као прочитану, архивирати, избрисати или пријавити као непожељну, без отварања картице. Кликните на сандуче да бисте га отворили на сајту сервиса.

Функције
- Сва сандучад на која сте пријављени, свако у својој боји и редоследом који одредите превлачењем
- Gmail: до десет налога, цела преписка с прилозима, претрага свих налога, звездице, изабране ознаке или само картица „Примарно“ и Google Meet једним кликом
- Yahoo Mail, AOL Mail, Yandex Mail и Mail.ru: поруке се читају у панелу
- Proton Mail: пошиљалац, наслов и време у панелу; сама порука се отвара на сајту Proton-а, јер је шифрована с краја на крај
- „Подсети ме касније“: склоните поруку до вечерас, до сутра или до следеће недеље
- Означавање као прочитано, архивирање, брисање и пријава непожељне поште из панела или из обавештења, уз опозив (Yandex Mail и Mail.ru без архиве)
- Обавештења и звук по избору, с тихим сатима, тихим сандучићима и правилима за пошиљаоце
- Бочна табла, пречица на тастатури и по један тастер за сваку радњу
- Светла и тамна тема, према систему
- Резервна копија подешавања у датотеци или у Chrome синхронизацији
- Бесплатно, без ограничења броја налога и без плаћене верзије

Yahoo Mail, AOL Mail, Proton Mail, Yandex Mail и Mail.ru немају јавни интерфејс за ово, па Mail Deck прати њихове сопствене веб-апликације, а промена на њиховој страни може да заустави неки сервис док се Mail Deck не ажурира.

Приватност
Mail Deck нема сопствене сервере ни аналитику. Комуницира само са Google-ом и са сервисима е-поште које укључите, са сваким преко сесије коју ваш прегледач већ има, а пошта сваког сервиса иде само том сервису. Никада не тражи и не чува вашу лозинку, а ваша подешавања остају у прегледачу.

Mail Deck је отвореног кода, под лиценцом Mozilla Public License 1.1: https://github.com/EAbychkov/mail-deck
Нису га направили Google, Yahoo, AOL, Proton, Yandex ни VK и није повезан с њима. Gmail је заштитни знак компаније Google LLC; остали називи припадају њиховим власницима.
```
