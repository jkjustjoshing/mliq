<?php
header("Content-type: text/xml");

echo '<?xml version="1.0" ?>';

?>

<mliq type="newPost" success="true" timestamp="<?php echo time(); ?>">
	<post id="20" time="<?php echo time(); ?>">
		<content>
			<?php echo $_POST['content'];
			?>		</content>
		<votes up="0" down="0" />
	</post>
</mliq>