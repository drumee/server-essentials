
<%= renderer.include('block/hello.tpl') %>
<%= renderer.include('block/subject.tpl') %>
<div class="outbound-files-list">
  <% _.each(files, function(file) { %>
    <div class="outbound-share-file">
      <span class="outbound-name"><%= file.filename %></span> 
      <span class="size"><%= file.filesize %></span> 
    </div>
  <% }) %>
</div>  
<% if(_.isEmpty(message) || message == "") { %>
  <div class="drumee-no-message-me"></div>
<% }else{ %>
  <div class="drumee-message-me-container">
    <div class="drumee-message-me">
      <p><%= message %></p>
    </div>
  </div>
<% } %>
<%= renderer.include('block/link.tpl', {label: lex._click_to_access}) %>
<%= renderer.include('block/signature.tpl') %>
