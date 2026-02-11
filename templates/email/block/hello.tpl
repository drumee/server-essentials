<div style="
    text-align: left;
    display: flex;
    padding-top:20px;
    margin-left:30px;
    margin-right:30px;
  ">
  <span style="
    color: #787B7F;
    font-family: Armin Grotesk, sans-serif;
    font-size: 18px;
    line-height:24px;
    text-align: left;
    padding-right: 0.3em;
    margin-bottom:10px;
  ">
    <%= lex._hello %>
  </span>  
  <span style="    
    color:#FA8540;
    line-height: 24px;
    font-size: 18px;
    font-family: Armin Grotesk, sans-serif;
    text-align: left;
  ">
    <% if(!_.isEmpty(recipient)) { %>
      <%= recipient.split('@')[0] %>
    <% } %>
  </span> 
</div>


