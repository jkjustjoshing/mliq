<?php
header("Content-type: text/xml");

echo '<?xml version="1.0" ?>';

?>

<mliq type="posts" sorted="chrono" timestamp="<?php echo time(); ?>">
	<post id="12" time="<?php echo time()-20; ?>">
		<content>
			One time I played Quidditch. It was fun. The next time I played Quidditch it was also fun. I want to play Quidditch all the time now. MLIQ
		</content>
		<votes up="15" down="2" />
	</post>
	<post id="11" time="<?php echo time()-200; ?>">
		<content>
			Jason is so freaking awesome. You have no idea how awesome he is. He is so awesome that, one time, his awesomeness made him score 5 times in a row. MLIQ
		</content>
		<votes up="10" down="4"/>
	</post>
	<post id="10" time="<?php echo time()-178500; ?>">
		<content>
			Why does my mind think the things it does? It's really confusing, the thoughts I think. Why don't I just stop thinking, that would be much easier, wouldn't it? Yeah... MLIQ	
		</content>
		<votes up="10" down="20" />
	</post>
	<post id="9" time="<?php echo time()-2000000; ?>">
		<content>
			I saw someone in a yellow shirt on campus and found it weird they didn't have a sock coming out of their pants. MLIQ
		</content>
		<votes up="10" down="20" />
	</post>
</mliq>

