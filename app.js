$(document).ready(() => {
    var isCollapsed = true; 
    var $main = $('.main');
    var $input = $('.search');

    function renderMatches(data) {
        var html = "";
        if($('.results-list')){
            $(".results-list").fadeTo("slow", 0.01, function(){ 
                $(this).slideUp("slow", function() { 
                    $(this).remove(); 
                });
            });
        }
        
        html = '<ul class="results-list">';
        $.each(data.query.pages, function(index, value) {
            var pageId = data.query.pages[index]['pageid'];
            var title = data.query.pages[index]['title'];
            var extract = data.query.pages[index]['extract'];
            if(!extract.endsWith('to:')){
                html += `<li>
                            <a href="https://en.wikipedia.org/?curid=${pageId}" target="_blank">
                                <div class="result">
                                    <div class="description">
                                        <h2>${title}</h2>
                                        <p>${extract}</p>
                                    </div>
                                </div>
                            </a>
                        </li>`;
            }
        });
                    
        html += '</ul>';
        $main.append(html);
    }

    function queryWiki(item) {
        $.ajax({
            type: "GET",
            url: `https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrsearch=${item}&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&callback=?`,
            contentType: "application/json; charset=utf-8",
            async: false,   
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                renderMatches(data);
            },
            error: function (errorMessage) {
                console.log('There was an error trying to get data from the specified url.');
            }
        });
    }

    $('.button').on('click', (event) => {
        if(isCollapsed) {
            $('.search').toggleClass('expanded');
            $('.button').toggleClass('active-btn');
            isCollapsed = false;
        } else {
            var searchItem = $input.val();
            if (searchItem.trim() === "") {
                $('.search').addClass('error');

            } else {
                $('.search').removeClass('error');
                queryWiki(searchItem);
            }
        }
        
    });

    $(".search").keyup(function(event){
        if(event.keyCode == 13){
            $(".button").click();
        }
    });
});